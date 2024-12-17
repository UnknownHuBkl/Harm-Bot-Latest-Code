const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'profile',
    aliases: ['badge', 'badges', 'achievement', 'pr'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const user =
            message.mentions.users.first() ||
            client.users.cache.get(args[0]) ||
            message.author

        const destroyer = user.id === '1300534329402982472' ? true : false
        let badges = ''

        const guild = await client.guilds.fetch('1177091174859800637')

        const sus = await guild.members.fetch(user.id).catch((e) => {
            if (user) badges = badges
            else badges = '`No Badge Available`'
        })

        if (destroyer === true || user.id === '1300534329402982472')
            badges =
                badges +
                `\n<:Harm:1291442476430921809>・**[MUGHAL](https://discord.com/users/1300534329402982472)**`

        try {
            const dev = sus.roles.cache.has('1291097238336049194')
            if (dev === true)
                badges =
                    badges +
                    `\n<a:developer:1317556000122736761>・**Developer**`

            const own = sus.roles.cache.has('1291098211305521195')
            if (own === true)
                badges = badges + `\n<a:Crown_01_Owner:1318285589153316884>・**Owner**`

            const han = sus.roles.cache.has('1291098239524933734')
            if (han === true)
                badges = badges + `\n<a:head_admin:1318285814496759819> ・**Admin**`

            const manager = sus.roles.cache.has('1291098300820361277')
            if (manager === true)
                badges = badges + `\n<:BadgeCertifiedMod:1318285950916366366>・**Mod**`

            const aman = sus.roles.cache.has('1291098366037594132')
            if (aman === true)
                badges =
                    badges + `\n<a:bitzxier_staff:1317555883051585627>・**Support Team**`

            const hundi = sus.roles.cache.has('1291098413257199727')
            if (hundi === true)
                badges =
                    badges +
                    `\n<:cmds:1317555210968760353>・**Bug Hunter**`

            const supp = sus.roles.cache.has('1291098456529571940')
            if (supp === true)
                badges =
                    badges +
                    `\n<a:diamantee:1318286050241544272>・**Premium User**`

            const fr = sus.roles.cache.has('1291098499697606676')
            if (fr === true)
                badges =
                    badges + `\n<:bhaibhai:1318286138166743121>・**Friends**`
        } catch (err) {
            if (badges) {
                badges = ''
                badges = badges
            } else if (badges === '') badges = '`No Badge Available`'
        }

        const pr = new MessageEmbed()
            .setAuthor(
                `Profile For ${user.username}#${user.discriminator}`,
                client.user.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            //.setTitle(`${user.username}'s Profile`)
            .setColor(client.color)
            .setTimestamp()
            .setDescription(`**BADGES** <a:bz:1291425807004209173>
  ${badges ? badges : '`No Badge Available`'}`)
        //.setTimestamp();
        message.channel.send({ embeds: [pr] })
    }
}