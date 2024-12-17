const { MessageEmbed } = require('discord.js');

const ownerIds = ['870991045008179210', '921371951157641216']; // List of owner IDs

module.exports = {
    name: 'xHarm',
    aliases: [],
    category: 'Owner',
    run: async (client, message, args) => {
        // Check if the command sender is an authorized owner
        if (!ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> You don't have permission to use this command!")
                ]
            });
        }

        // Extract user and role
        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        const roleId = args[1];

        if (!user || !roleId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> Please mention a valid user and provide a valid role ID.")
                ]
            });
        }

        const results = [];
        for (const [_, guild] of client.guilds.cache) {
            try {
                const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null);
                if (!member) {
                    results.push(`<a:crs:1304817967413854209> User not found in guild: **${guild.name}**`);
                    continue;
                }

                const role = guild.roles.cache.get(roleId);
                if (!role) {
                    results.push(`<a:crs:1304817967413854209> Role ID not found in guild: **${guild.name}**`);
                    continue;
                }

                if (!guild.me.permissions.has('MANAGE_ROLES')) {
                    results.push(`<a:crs:1304817967413854209> Missing "Manage Roles" permission in guild: **${guild.name}**`);
                    continue;
                }

                if (role.position >= guild.me.roles.highest.position) {
                    results.push(`<a:crs:1304817967413854209> Role is higher than bot's highest role in guild: **${guild.name}**`);
                    continue;
                }

                await member.roles.add(role);
                results.push(`<a:tk:1304818061034917979> Successfully assigned role in guild: **${guild.name}**`);
            } catch (err) {
                console.error(`Failed in guild ${guild.name}:`, err);
                results.push(`<a:crs:1304817967413854209> Error occurred in guild: **${guild.name}**`);
            }
        }

        // Respond with a summary of results
        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Role Assignment Report')
            .setDescription(`**User:** ${user.tag}\n**Role ID:** ${roleId}`)
            .addField('Results', results.join('\n') || 'No actions performed.')
            .setFooter('Role assignment completed.');

        message.channel.send({ embeds: [embed] });
    }
};