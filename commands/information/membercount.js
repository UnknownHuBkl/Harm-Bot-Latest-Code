const { Message, Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'membercount',
    aliases: ['mc'],
    category: 'info',
    premium: false,

    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle(`**<a:has:1291446963795001407> MemberCount**`)
            .setDescription(`<:me:1291447339399123004>  ${message.guild.memberCount}`)
            .setTimestamp()

        message.channel.send({ embeds: [embed] })
    }
}
