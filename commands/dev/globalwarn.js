const { MessageEmbed } = require('discord.js');

const botOwners = ['1300534329402982472', '1300534329402982472']; // Add your owner IDs here

module.exports = {
    name: 'gwarn',
    aliases: ['gwarning'],
    category: 'Owner',
    run: async (client, message, args) => {
        // Check if the user is a bot owner
        if (!botOwners.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | You don't have permission to use this command.`)
                ]
            });
        }

        // Extract user mention or ID
        let userId = args[0];
        if (!userId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Please provide a valid user ID or mention a user.`)
                ]
            });
        }

        // Fetch the user object
        let user;
        try {
            user = await client.users.fetch(userId.replace(/[<@!>]/g, ''));
        } catch (error) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Unable to fetch user. Please check the provided ID.`)
                ]
            });
        }

        // Send warning as a DM
        try {
            const embed = new MessageEmbed()
                .setTitle('Harm Global Warning | <:stolen_emoji:1317791407695462480>')
                .setDescription(
                    `You have received a warning from the server: **${message.guild.name}**.\n\n` +
                    `**Reason:** ${args.slice(1).join(' ') || 'No specific reason provided.'}`
                )
                .setColor('#000000') // Black color
                .setFooter('Please ensure you follow the server rules to avoid further action.');

            await user.send({ embeds: [embed] });

            // Confirmation message
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`<:stolen_emoji:1317791407695462480> Successfully sent a warning to **${user.tag}**.`)
                ]
            });
        } catch (error) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`<:anxCross:1317554876712222794> | Failed to send a warning. The user might have DMs disabled.`)
                ]
            });
        }
    }
};