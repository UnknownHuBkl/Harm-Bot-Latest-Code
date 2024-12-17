const { Message, Client, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'warnremove',
    aliases: ['removewarn', 'rwarn'],
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

        // Ensure an argument (a user mention or ID) and warning index are provided
        const user = args[0]
            ? message.mentions.users.first() || message.guild.members.cache.get(args[0])
            : null;

        const warnIndex = args[1] ? parseInt(args[1], 10) - 1 : null;

        if (!user || isNaN(warnIndex)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please mention a user and provide a valid warning index to remove. Example: \`!warnremove @user 2\`.`
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
                            `<:emoji_1725906884992:1306038885293494293>  | **${user.tag}** has no warnings to remove.`
                        )
                ]
            });
        }

        // Check if the warning index is valid
        if (warnIndex < 0 || warnIndex >= userWarnings.length) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Invalid warning index. Please provide a valid index between 1 and ${userWarnings.length}.`
                        )
                ]
            });
        }

        // Remove the specified warning
        userWarnings.splice(warnIndex, 1);

        // Update the warnings data
        warningsData[user.id] = userWarnings;

        // Write the updated warnings data to the file
        fs.writeFileSync(warningsFilePath, JSON.stringify(warningsData, null, 2));

        // Send a confirmation message
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully removed warning **${warnIndex + 1}** for **${user.tag}**.`
                    )
            ]
        });
    }
};
