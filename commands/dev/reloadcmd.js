const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
const ricky = ['1300534329402982472', '1300534329402982472']
module.exports = {
    name: 'reload',
    aliases: ['rlcmd'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!ricky.includes(message.author.id)) return
        try {
            let reload = false
            for (let i = 0; i < client.categories.length; i += 1) {
                let dir = client.categories[i]
                try {
                    if (!args[0]) {
                        const opp = new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | You didn't provided the command name.`
                            )
                        return message.channel.send({ embeds: [opp] })
                    }
                    delete require.cache[
                        require.resolve(`../../commands/${dir}/${args[0]}.js`)
                    ]
                    client.commands.delete(args[0])
                    const pull = require(`../../commands/${dir}/${args[0]}.js`)
                    client.commands.set(args[0], pull)
                    reload = true
                } catch {}
            }
            if (reload) {
                const op = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(
                        `<a:Tick:1306038825054896209> | Successfully reloaded \`${args[0]}\``
                    )
                return message.channel.send({ embeds: [op] })
            }
            const notop = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:emoji_1725906884992:1306038885293494293>  | I was unable to reload \`${args[0]}\``
                )
            return message.channel.send({ embeds: [notop] })
        } catch (e) {
            const emesdf = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `<:emoji_1725906884992:1306038885293494293>  | I was unable to reload \`${args[0]}\``
                )
            return message.channel.send({ embeds: [emesdf] })
        }
    }
}
