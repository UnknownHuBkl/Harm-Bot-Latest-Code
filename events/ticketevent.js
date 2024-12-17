const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'create_ticket') {
            // Check if the "Harm Ticket" category exists
            let ticketCategory = interaction.guild.channels.cache.find(
                (channel) => channel.name === "Harm Ticket" && channel.type === 4
            );

            if (!ticketCategory) {
                ticketCategory = await interaction.guild.channels.create('Harm Ticket', {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id, // Default @everyone role
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                });
            }

            // Check or create the "Ticket Manager" role
            let ticketManagerRole = interaction.guild.roles.cache.find(
                (role) => role.name === 'Ticket Manager'
            );

            if (!ticketManagerRole) {
                ticketManagerRole = await interaction.guild.roles.create({
                    name: 'Ticket Manager',
                    color: 'BLACK',
                    permissions: []
                });
            }

            // Check if the user already has an open ticket
            const existingChannel = interaction.guild.channels.cache.find(
                (channel) =>
                    channel.name === `ticket-${interaction.user.username.toLowerCase()}` &&
                    channel.parentId === ticketCategory.id
            );

            if (existingChannel) {
                return interaction.reply({
                    content: `You already have an open ticket: <#${existingChannel.id}>.`,
                    ephemeral: true
                });
            }

            // Create the ticket channel
            const ticketChannel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
                type: 'GUILD_TEXT',
                parent: ticketCategory.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id, // Default @everyone role
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: interaction.user.id, // Ticket creator
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                    },
                    {
                        id: ticketManagerRole.id, // Ticket Manager role
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES']
                    }
                ]
            });

            // Create the embed for the ticket
            const ticketEmbed = new MessageEmbed()
                .setTitle('🎟 Harm Ticket')
                .setDescription(`Hello <@${interaction.user.id}>! A staff member will assist you shortly.\n\nIf you wish to close this ticket, click the button below.`)
                .setColor('BLACK');

            // Create the "Close Ticket" button
            const closeButton = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('close_ticket')
                    .setLabel('Close Ticket')
                    .setStyle('DANGER')
            );

            // Send the embed and button in the ticket channel
            await ticketChannel.send({
                content: `Hello <@${interaction.user.id}>! <@&${ticketManagerRole.id}> has been notified.`,
                embeds: [ticketEmbed],
                components: [closeButton]
            });

            // Acknowledge the button press
            await interaction.reply({
                content: `Your ticket has been created: <#${ticketChannel.id}>.`,
                ephemeral: true
            });
        }

        // Handle closing the ticket
        if (interaction.customId === 'close_ticket') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({
                    content: 'This command can only be used inside a ticket channel.',
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: 'Closing this ticket in 5 seconds...',
                ephemeral: true
            });

            setTimeout(async () => {
                await interaction.channel.delete().catch(console.error);
            }, 5000);
        }
    });
};