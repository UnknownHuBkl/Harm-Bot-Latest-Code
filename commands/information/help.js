const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const prefix = message.guild?.prefix || '&'; // Default prefix if not set

        // First MessageSelectMenu (Main Categories)
        const selectMenu1 = new MessageSelectMenu()
            .setCustomId('categorySelect1')
            .setPlaceholder('> Select Main Category')
            .addOptions([
                {
                    label: 'All',
                    value: 'all',
                    description: 'Show all commands',
                },
                {
                    label: 'AntiNuke',
                    value: 'antinuke',
                    description: 'Commands related to AntiNuke',
                },
                {
                    label: 'Moderation',
                    value: 'mod',
                    description: 'Commands related to Moderation',
                },
                {
                    label: 'Utility',
                    value: 'info',
                    description: 'Utility commands',
                },
                {
                    label: 'Welcomer',
                    value: 'welcomer',
                    description: 'Commands for Welcomer',
                },
                {
                    label: 'Voice',
                    value: 'voice',
                    description: 'Commands related to Voice',
                },
            ]);

        // Second MessageSelectMenu (Sub-Categories or Additional Features)
        const selectMenu2 = new MessageSelectMenu()
            .setCustomId('categorySelect2')
            .setPlaceholder('> Select Extra Features')
            .addOptions([
                {
                    label: 'Logging',
                    value: 'logging',
                    description: 'Commands for Logging',
                },
                {
                    label: 'Automod',
                    value: 'automod',
                    description: 'Commands for Automod',
                },
                {
                    label: 'Custom Role',
                    value: 'customrole',
                    description: 'Commands for Custom Roles',
                },
                {
                    label: 'Giveaway',
                    value: 'giveaway',
                    description: 'Commands for Giveaway',
                },
                {
                    label: 'Autoresponder',
                    value: 'autoresponder',
                    description: 'Commands for AutoResponder',
                },
                {
                    label: 'Ticket',
                    value: 'ticket',
                    description: 'Commands for Ticket',
                },
            ]);

        // Create action row with buttons
        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite Me')
                    .setStyle('LINK')
                    .setURL('https://discord.com/oauth2/authorize?client_id=1317459455516086292&permissions=8&integration_type=0&scope=bot+applications.commands'),
                new MessageButton()
                    .setLabel('Support')
                    .setStyle('LINK')
                    .setURL('https://discord.gg/rfzop'),
                new MessageButton()
                    .setLabel('Home')
                    .setCustomId('homeButton')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel('Delete')
                    .setCustomId('deleteButton')
                    .setStyle('DANGER')
            );

        // Embed message
        const embed = new MessageEmbed()
            .setColor(client.color) // Red color for the embed
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Hello! I'm Harm, your server security bot with powerful Antinuke features.\n\n<a:emoji_1725906997325:1306050585404903424> Prefix for this server: \`${prefix}\`\n<a:emoji_1725906997325:1306050585404903424>Type \`${prefix}antinuke enable\` to get started up!\n<a:emoji_1725906997325:1306050585404903424> Total Commands: \`${client.commands.size}\`\n`
            )
            .addField(
                '__Main Modules__',
                `
                <:Security:1317554933326942289> **AntiNuke**\n<:Moderation:1317554818902003753> **Moderation**\n<:anxExtra:1317555079066161152> **Utility**\n<:Welcome:1317554790905024512> **Welcomer**\n**Links**\n[Support](https://discord.gg/rfzop) **|** [Invite Me](https://discord.com/oauth2/authorize?client_id=1317459455516086292&permissions=8&integration_type=0&scope=bot+applications.commands)
                `,
                true
            )
            .addField('\u200b', '\u200b', true)
            .addField(
                '__Extra Modules__',
                `
                <:Voice:1317554776384340008> **Voice**\n<:banHammer:1317555225397166142> **Custom Role**\n<:Globe:1317554760043200522> **Logging**\n<:anxSettings:1317555098435457064> **Automod**\n<:anxGW:1317555051665035406> **Giveaway**\n<:anxMedia:1317555198146773003> **AutoResponder**\n<:Voice:1317554776384340008> **Join To Create**\n<:anxTicket:1317555267810099250> **Fun**
                `,
                true
            )
            .setFooter({
                text: 'Developed by Team Harm',
                iconURL: client.user.displayAvatarURL()
            });

        // Send the initial help message with both select menus
        const helpMessage = await message.channel.send({
            embeds: [embed],
            components: [actionRow, new MessageActionRow().addComponents(selectMenu1), new MessageActionRow().addComponents(selectMenu2)]
        });

        // Component collector for interactions
        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'deleteButton') {
                await helpMessage.delete();
                return;
            }

            if (i.customId === 'homeButton' || i.values?.[0] === 'home') {
                await i.deferUpdate();
                return helpMessage.edit({
                    embeds: [embed],
                    components: [actionRow, new MessageActionRow().addComponents(selectMenu1), new MessageActionRow().addComponents(selectMenu2)]
                });
            }

            await i.deferUpdate();

            const category = i.values[0];
            let commands = [];

            // Handling categories for the first select menu (Main Categories)
            if (i.customId === 'categorySelect1') {
                if (category === 'all') {
                    commands = client.commands.map((x) => `\`${x.name}\``);
                } else {
                    const categoryMap = {
                        antinuke: 'security',
                        mod: 'mod',
                        info: 'info',
                        welcomer: 'welcomer',
                        voice: 'voice',
                    };
                    const filteredCategory = categoryMap[category];
                    commands = client.commands
                        .filter((x) => x.category === filteredCategory)
                        .map((x) => `\`${x.name}\``);
                }
            }
            
            // Handling categories for the second select menu (Extra Features)
            if (i.customId === 'categorySelect2') {
                const extraCategoryMap = {
                    logging: 'logging',
                    automod: 'automod',
                    customrole: 'customrole',
                    giveaway: 'giveaway',
                    autoresponder: 'autoresponder',
                    ticket: 'ticket',
                };
                const filteredCategory = extraCategoryMap[category];
                commands = client.commands
                    .filter((x) => x.category === filteredCategory)
                    .map((x) => `\`${x.name}\``);
            }

            const categoryEmbed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(
                    `**${category.charAt(0).toUpperCase() + category.slice(1)} Commands**\n${commands.join(', ')}`
                );

            helpMessage.edit({
                embeds: [categoryEmbed],
                components: [actionRow, new MessageActionRow().addComponents(selectMenu1), new MessageActionRow().addComponents(selectMenu2)]
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                helpMessage.edit({ components: [] });
            }
        });
    }
};
