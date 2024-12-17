const { Message, Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'warnlist',
    aliases: ['warnings'],
    category: 'mod',
    premium: true,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Check if the user has 'MANAGE_MESSAGES' permission
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permission to use this command.`
                        )
                ]
            });
        }

        // Ensure that an argument (a user mention or ID) is provided
        const user = args[0]
            ? message.mentions.users.first() || message.guild.members.cache.get(args[0])
            : null;

        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please mention a user or provide their ID to view their warnings.`
                        )
                ]
            });
        }

        // Path to the JSON file storing warnings
        const warningsFilePath = path.join(__dirname, 'warnings.json');

        // Check if the warnings file exists
        if (!fs.existsSync(warningsFilePath)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | No warnings data found.`
                        )
                ]
            });
        }

        // Read the warnings data from the file
        const warningsData = JSON.parse(fs.readFileSync(warningsFilePath, 'utf-8'));

        // Check if the user has any warnings
        const userWarnings = warningsData[user.id] || [];

        if (userWarnings.length === 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **${user.tag}** has no warnings.`
                        )
                ]
            });
        }

        // Build the embed message showing the list of warnings
        let warningList = userWarnings.map((warn, index) => {
            return `**Warning ${index + 1}:** ${warn.reason} - Issued by: ${warn.issuedBy}`;
        }).join('\n');

        // Send the embed message with the warnings
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTitle(`Warnings for ${user.tag}`)
                    .setDescription(warningList)
                    .setFooter(`Total Warnings: ${userWarnings.length}`)
            ]
        });
    }
};
