const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'addemoji',
    aliases: ['addemote', 'steal'],
    cooldown: 5,
    category: 'info',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }
        if (!message.guild.me.permissions.has('MANAGE_EMOJIS')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I must have \`Manage Emoji\` perms to use this command.`
                        )
                ]
            })
        }
        let emoji = args[0]
        if (!emoji) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You didn't provided any emoji to add.`
                        )
                ]
            })
        }
        let emojiId = null
        try {
            emojiId = emoji.match(/([0-9]+)/)[0]
        } catch (err) {}
        if (!emojiId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You provided an invalid emoji.`
                        )
                ]
            })
        }
        let name = args[1] || 'Harm_OP'
        let link = `https://cdn.discordapp.com/emojis/${emojiId}`
        try {
            await message.guild.emojis.create(link, name).then((newEmoji) => {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | Successfully added the emoji ${newEmoji.toString()}.`
                            )
                    ]
                })
            })
        } catch (err) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I was unable to add the emoji.\nPossible Reasons: \`Mass emojis added\`, \`Slots are Full\`.`
                        )
                ]
            })
        }
    }
}
