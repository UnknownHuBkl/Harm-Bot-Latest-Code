const { MessageEmbed } = require('discord.js');
const ms = require('ms');

let giveaways = new Map();  // Storing ongoing giveaways

module.exports = {
    name: 'gpause',
    description: 'Pause an ongoing giveaway.',
    category: 'giveaway',
    usage: 'gpause <giveaway_message_id>',

    async run(client, message, args) {
        // Check if the message author has the necessary permission
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> You need `Manage Server` permission to pause a giveaway.')
                        .setColor('RED')
                ]
            });
        }

        // Fetch the giveaway message ID from the arguments
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

        // Find the giveaway in the ongoing giveaways map
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

        // Pause the giveaway
        if (giveaway.paused) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription('<:anxCross:1317554876712222794> This giveaway is already paused.')
                        .setColor('RED')
                ]
            });
        }

        // Set the giveaway state to paused
        giveaway.paused = true;

        // Edit the giveaway message to notify users that the giveaway is paused
        const giveawayMessage = await message.channel.messages.fetch(giveawayMessageId);
        await giveawayMessage.edit({
            embeds: [
                new MessageEmbed()
                    .setTitle('🎉 FlaMe Giveaway Paused!🎉')
                    .setDescription(`**<:dot:1314799225120227388> Prize:** ${giveaway.prize}
**<:dot:1314799225120227388> Duration:** ${giveaway.duration}
**<:dot:1314799225120227388> Hosted By:** ${giveaway.host}
**<:dot:1314799225120227388> Status:** **Paused**`)
                    .setColor('BLACK')
                    .setFooter(' Giveaway is paused, no new reactions allowed!')
            ]
        });

        message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription('<:anxCross:1317554876712222794> The giveaway has been paused. No new participants can join until it is resumed.')
                    .setColor('RED')
            ]
        });
    },
};

// Add a helper function to start a giveaway and track it (in your gstart command):
module.exports = {
    name: 'gstart',
    description: 'Start a giveaway.',
    category: 'giveaway',
    usage: 'gstart <time> <winner_count> <prize>',
  
    async run(client, message, args) {
        // Existing code for starting the giveaway

        // After creating and sending the giveaway message
        const giveawayMessage = await message.channel.send({
            embeds: [embed],
        });

        // Store giveaway details in the `giveaways` Map
        giveaways.set(giveawayMessage.id, {
            prize,
            duration: time,
            host: message.author,
            winnerCount,
            messageId: giveawayMessage.id,
            paused: false, // Initially, the giveaway is not paused
        });

        // React to the giveaway message
        await giveawayMessage.react('🎉');
    },
};
