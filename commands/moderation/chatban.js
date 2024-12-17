const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'chatban',
    category: 'mod',
    run: async (client, message, args) => {
        // Check if the user has necessary permissions
        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | You must be the **Guild Owner** or have \`Manage Channels\` permission to use this command.`
                        ),
                ],
            });
        }

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | You must mention a user or provide their ID to chatban.`
                        ),
                ],
            });
        }

        // Prevent banning the guild owner or the bot itself
        if (member.id === message.guild.ownerId || member.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(`<:anxCross:1317554876712222794> | You cannot chatban this user.`),
                ],
            });
        }

        try {
            // Set permissions to deny sending messages in all channels
            message.guild.channels.cache.forEach((channel) => {
                if (channel.isText()) {
                    channel.permissionOverwrites.create(member, {
                        SEND_MESSAGES: false,
                    });
                }
            });

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(
                            `<a:tk:1304818061034917979> | Successfully chatbanned <@${member.user.id}>.`
                        ),
                ],
            });
        } catch (err) {
            console.error(err);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | An error occurred while trying to chatban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};