const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vcunban',
    category: 'mod',
    description: 'Restores all voice channel permissions for a user in all voice channels.',
    run: async (client, message, args) => {
        // Check if the user has the necessary permissions to manage channels
        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | You must be the **Guild Owner** or have \`Manage Channels\` permission to use this command.`
                        ),
                ],
            });
        }

        // Get the member whose permissions will be restored
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | You must mention a user or provide their ID to restore voice permissions.`
                        ),
                ],
            });
        }

        try {
            // Loop through all the channels in the guild and restore permissions in voice channels
            message.guild.channels.cache.forEach(async (channel) => {
                if (channel.type === 'GUILD_VOICE') {
                    await channel.permissionOverwrites.create(member, {
                        CONNECT: true,  // Allow the user to connect
                        SPEAK: true,    // Allow the user to speak
                        USE_VAD: true,  // Allow voice activity (optional)
                    });
                }
            });

            // Send success message
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(
                            `<a:tk:1304818061034917979> | Successfully restored all voice permissions for <@${member.user.id}> in all voice channels.`
                        ),
                ],
            });
        } catch (err) {
            console.error('Error restoring all voice permissions:', err);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(
                            `<:anxCross:1317554876712222794> | An error occurred while restoring permissions for <@${member.user.id}> in all voice channels.`
                        ),
                ],
            });
        }
    },
};