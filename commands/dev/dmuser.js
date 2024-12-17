const { MessageEmbed } = require('discord.js');

// Define specific bot owner IDs (add the user IDs who can run the command)
const BOT_OWNERS = ['1300534329402982472', '1300534329402982472']; // Replace with actual bot owner IDs

module.exports = {
    name: 'xtyper',
    aliases: ['dmuser'],
    category: 'owner',
    run: async (client, message, args) => {
        // Ensure that only the specified bot owners can use this command
        if (!BOT_OWNERS.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Only the Specified Bot Owner(s) Can Use This Command!**`
                        )
                ]
            });
        }

        // Extract the user mention or ID and the message content
        const userMention = args[0];
        const reason = args.slice(1).join(' ');

        // Validate user mention and message content
        if (!userMention) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Please Mention a User or Provide Their ID.**`
                        )
                ]
            });
        }
        if (!reason) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Please Provide a Message to Send.**`
                        )
                ]
            });
        }

        // Fetch the user
        const user = getUserFromMention(client, userMention);
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Could Not Find the Specified User. Please Provide a Valid Mention or ID.**`
                        )
                ]
            });
        }

        // Prepare the DM message embed
        const dmEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('🎄 Harm Message 🎄')
            .setDescription(
                `**From:** <@${message.author.id}> (${message.author.id})\n\n${reason}`
            )
            .setFooter({
                text: `Message from ${message.guild.name}`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setTimestamp();

        // Send the DM
        try {
            await user.send({ embeds: [dmEmbed] });
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:tk:1304818061034917979> | **Successfully Sent the Message to <@${user.id}> (${user.tag}).**`
                        )
                ]
            });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:anxCross:1317554876712222794> | **Failed to Send the Message to <@${user.id}> (${user.tag}). They May Have DMs Disabled.**`
                        )
                ]
            });
        }
    }
};

// Helper function to fetch a user by mention or ID
function getUserFromMention(client, mention) {
    if (!mention) return null;
    const matches = mention.match(/^<@!?(\d+)>$/);
    const id = matches ? matches[1] : mention;
    return client.users.cache.get(id) || null;
}
