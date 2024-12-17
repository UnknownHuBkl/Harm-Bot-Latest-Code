const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const wait = require('wait');

this.config = require(`${process.cwd()}/config.json`);

// MongoDB connection (adjust as necessary)
mongoose.connect(this.config.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = {
    name: 'killmode',
    aliases: ['km'],
    cooldown: 10,
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
        // Check if the user is authorized
        let own = message.author.id === message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild);
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | **Only the server owner or extra owners can execute this command.**`
                        ),
                ],
            });
        }

        // Get the option (enable/disable) and reason
        const option = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // If no option is provided, display usage instructions
        if (!option) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `**Usage:** \n\n$killmode enable [reason] - Enable killmode and DM all users. \n$killmode disable [reason] - Disable killmode and DM all users.`
                        ),
                ],
            });
        }

        // DM all users function
        const sendDMToAllUsers = async (reasonText) => {
            // Loop through all members and send a DM with the reason
            message.guild.members.fetch().then(async (members) => {
                members.forEach(async (member) => {
                    if (member.user.bot) return; // Skip bots
                    try {
                        await member.send(
                            `**Killmode Notification**\n\nKillmode has been ${option === 'enable' ? 'enabled' : 'disabled'} in the server. Reason: ${reasonText}`
                        );
                    } catch (err) {
                        console.log(`Could not DM ${member.user.tag}: ${err}`);
                    }
                });
            });
        };

        // Handle enable option
        if (option === 'enable') {
            await sendDMToAllUsers(reason);

            // Send confirmation message to the channel
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Killmode enabled! All users have been DM'd the reason.**`
                        ),
                ],
            });
        }

        // Handle disable option
        if (option === 'disable') {
            await sendDMToAllUsers(reason);

            // Send confirmation message to the channel
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209> | **Killmode disabled! All users have been DM'd the reason.**`
                        ),
                ],
            });
        }

        // Invalid option handling
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `**Invalid option.** Please use \`$killmode enable [reason]\` or \`$killmode disable [reason]\`.`
                    ),
            ],
        });
    },
};
