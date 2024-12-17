module.exports = {
    name: 'gresume',
    description: 'Resume a paused giveaway.',
    category: 'giveaway',
    usage: 'gresume <giveaway_message_id>',

    async run(client, message, args) {
        // Check if the message author has the necessary permission
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> You need `Manage Server` permission to resume a giveaway.')
                        .setColor('RED')
                ]
            });
        }

        const giveawayMessageId = args[0];
        if (!giveawayMessageId) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> Please specify a valid giveaway message ID.')
                        .setColor('RED')
                ]
            });
        }

        const giveaway = giveaways.get(giveawayMessageId);
        if (!giveaway) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> No giveaway found with that message ID.')
                        .setColor('RED')
                ]
            });
        }

        if (!giveaway.paused) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> This giveaway is not paused.')
                        .setColor('RED')
                ]
            });
        }

        giveaway.paused = false;

        // Reactivate the giveaway by editing the message again
        const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId);
        await giveawayMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setTitle('🎉 FlaMe Giveaway!🎉')
                    .setDescription(`**<:dot:1314799225120227388> Prize:** ${giveaway.prize}
**<:dot:1314799225120227388> Duration:** ${giveaway.duration}
**<:dot:1314799225120227388> Hosted By:** ${giveaway.host}
**<:dot:1314799225120227388> Status:** **Active**`)
                    .setColor('BLACK')
                    .setFooter(' React with 🎉 to enter!')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription('<:anxCross:1317554876712222794> The giveaway has been resumed. You can now react to participate!')
                    .setColor('GREEN')
            ]
        });
    },
};
