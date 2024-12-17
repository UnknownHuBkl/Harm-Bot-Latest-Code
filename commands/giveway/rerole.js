const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'greroll',
    description: 'Reroll a giveaway.',
    category: 'giveaway',
    usage: 'greroll <message_id>',

    async run(client, message, args) {
        // Check permissions
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> You need `Manage Server` permission to reroll a giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Get the message ID of the giveaway
        const giveawayMessageId = args[0];
        if (!giveawayMessageId) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please provide a valid giveaway message ID.')
                        .setColor('RED')
                ]
            });
        }

        // Fetch the giveaway data from the stored giveaways
        const giveaway = client.giveaways && client.giveaways[giveawayMessageId];
        if (!giveaway) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> No giveaway found with that message ID.')
                        .setColor('RED')
                ]
            });
        }

        // Get the giveaway message
        const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId);

        // React to the message with 🎉
        const reaction = giveawayMessage.reactions.cache.get('🎉');
        if (!reaction) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Giveaway message does not have reactions!')
                        .setColor('RED')
                ]
            });
        }

        const users = await reaction.users.fetch();
        const participants = users.filter((u) => !u.bot).random(giveaway.winnerCount);

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
                    .setTitle('🎉 FlaMe Giveaway Rerolled!🎉')
                    .setDescription(`**<:dot:1314799225120227388> Prize:** ${giveaway.prize}
**<:dot:1314799225120227388> New Winners:** ${winners}
**<:dot:1314799225120227388> Hosted By:** ${message.author}`)
                    .setColor('BLACK')
            ]
        });
    },
};