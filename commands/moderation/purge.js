const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'purge',
    aliases: ['clear'],
    category: 'mod',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Messages\` permissions to use this command.`
                        )
                ]
            })
        } else {
            const amount = args[0]
            if (!amount) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:cr:1290949952922718230> | You must provide the number of messages to be deleted.`
                            )
                    ]
                })
            } else {
                if (!parseInt(amount)) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<a:cr:1290949952922718230> | You must provide a valid number of messages to be deleted.`
                                )
                        ]
                    })
                } else if (amount >= 1000) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(
                                    `<a:cr:1290949952922718230> | You can't delete more than **999** messages at a time.`
                                )
                        ]
                    })
                } else {
                    await message.delete().catch((_) => {})
                    Delete(message.channel, amount)
                    message.channel
                        .send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `<a:Tick:1306038825054896209> | Successfully deleted ${amount} messages.`
                                    )
                            ]
                        })
                        .then((m) => {
                            setTimeout(() => {
                                m.delete().catch(() => {})
                            }, 2000)
                        })
                }
            }
        }
    }
}

function Delete(channel, amount) {
    for (let i = amount; i > 0; i -= 100) {
        if (i > 100) {
            channel.bulkDelete(100).catch((_) => {})
        } else {
            channel.bulkDelete(i).catch((_) => {})
        }
    }
}
