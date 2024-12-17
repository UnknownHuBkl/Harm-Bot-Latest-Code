const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'softban',
    aliases: ['tempban', 'kickban'],
    category: 'mod',
    premium: false,

    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        // Check if the user has 'BAN_MEMBERS' permission
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }

        // Check if the bot has 'BAN_MEMBERS' permission
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Ban Members\` permissions to use this command.`
                        )
                ]
            });
        }

        // Get the user from mention or ID
        let user = await getUserFromMention(message, args[0]);
        if (!user) {
            try {
                user = await client.users.fetch(args[0]);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | Please Provide a valid user ID or Mention a member.`
                            )
                    ]
                });
            }
        }

        // Reason for softban
        let reason = args.slice(1).join(' ') || 'No reason provided.';
        reason = `${message.author.tag} (${message.author.id}) | ` + reason;

        // Error message for user not found
        const userNotFoundEmbed = new MessageEmbed()
            .setDescription(`<:emoji_1725906884992:1306038885293494293> | User Not Found`)
            .setColor(client.color);

        if (user === undefined) return message.channel.send({ embeds: [userNotFoundEmbed] });

        // Prevent banning bot itself
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | If you softban me, who will protect your server?`
                        )
                ]
            });
        }

        // Prevent banning the server owner
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I can't softban the owner of this server.`
                        )
                ]
            });
        }

        // Prevent banning users with higher roles
        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        // Check if the user is in the server
        let check = message.guild.members.cache.has(user.id);
        if (check === true || user.banable) {
            try {
                const softBanMessage = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(
                        `**You have been softbanned from ${message.guild.name}**\nExecutor: ${message.author.tag}\nReason: \`${reason}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                let member = await message.guild.members.fetch(user, true);

                // Ban the user and immediately unban them (softban)
                await message.guild.members.ban(member.id, { reason: reason });
                await message.guild.members.unban(member.id);

                // Send the softban message to the user
                await member.send({ embeds: [softBanMessage] }).catch((err) => null);
            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | My highest role is below **<@${user.id}>**`
                    )
                    .setColor(client.color);
                return message.channel.send({ embeds: [embed] });
            }

            // Success message
            const done = new MessageEmbed()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully softbanned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);
            return message.channel.send({ embeds: [done] });
        }

        // If user is not in the server, try to ban them by ID
        if (check === false) {
            try {
                const softBanMessage = new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(
                        `**You have been softbanned from ${message.guild.name}**\nExecutor: ${message.author.tag}\nReason: \`${reason}\``
                    )
                    .setColor(client.color)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                let member = await client.users.fetch(user, true);

                // Ban and unban the user by ID
                await message.guild.bans.create(member.id, { reason: reason });
                await message.guild.bans.remove(member.id);

            } catch (err) {
                const embed = new MessageEmbed()
                    .setDescription(
                        `<:emoji_1725906884992:1306038885293494293>  | My highest role is below or the same as **<@${user.id}>**`
                    )
                    .setColor(client.color);
                return message.channel.send({ embeds: [embed] });
            }

            // Success message
            const done = new MessageEmbed()
                .setDescription(
                    `<a:Tick:1306038825054896209> | Successfully softbanned **<@${user.id}>** from the server.`
                )
                .setColor(client.color);
            return message.channel.send({ embeds: [done] });
        }
    }
};

// Helper function to get a user from a mention or ID
function getUserFromMention(message, mention) {
    if (!mention) return null;

    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return null;

    const id = matches[1];
    return message.client.users.fetch(id);
}
