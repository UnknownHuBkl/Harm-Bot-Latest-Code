const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ms = require('ms'); // For parsing duration strings

module.exports = {
    name: 'gstart',
    description: 'Start a giveaway.',
    category: 'giveaway',
    usage: 'gstart <time> <winner_count> <prize>',

    async run(client, message, args) {
        // Check permissions
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> You need `Manage Server` permission to start a giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Parse arguments
        const time = args[0];
        const winnerCount = parseInt(args[1]);
        const prize = args.slice(2).join(' ');

        if (!time || !ms(time)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please specify a valid duration (e.g., `10m`, `1h`, `1d`).')
                        .setColor('RED')
                ]
            });
        }

        if (!winnerCount || isNaN(winnerCount) || winnerCount <= 0) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please specify a valid number of winners.')
                        .setColor('RED')
                ]
            });
        }

        if (!prize) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please specify the prize for the giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Create giveaway embed
        const embed = new MessageEmbed()
            .setTitle('🎉 FlaMe Giveaway!🎉')
            .setDescription(`**<:dot:1314799225120227388> Prize:** ${prize}
**<:dot:1314799225120227388> Duration:** ${time}
**<:dot:1314799225120227388> Hosted By:** ${message.author}`)
            .setColor('BLACK')
            .setTimestamp(Date.now() + ms(time))
            .setFooter(' React with 🎉 to enter!');

        // Send the giveaway message
        const giveawayMessage = await message.channel.send({
            embeds: [embed],
        });

        // React to the message with 🎉
        await giveawayMessage.react('🎉');

        // Wait for the giveaway to end
        setTimeout(async () => {
            const reaction = giveawayMessage.reactions.cache.get('🎉');
            if (!reaction) return;

            const users = await reaction.users.fetch();
            const participants = users.filter((u) => !u.bot).random(winnerCount);

            if (!participants.length) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription('<:anxCross:1317554876712222794> No valid participants, giveaway canceled.')
                            .setColor('RED')
                    ]
                });
            }

            const winners = participants.map((u) => `<@${u.id}>`).join(', ');
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('🎉 FlaMe Giveaway Ended!🎉')
                        .setDescription(`**<:dot:1314799225120227388> Prize:** ${prize}
**<:dot:1314799225120227388> Winners:** ${winners}
**<:dot:1314799225120227388> Hosted By:** ${message.author}`)
                        .setColor('BLACK')
                ]
            });
        }, ms(time));
    },
};