const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js')
module.exports = {
    name: 'autologs',
    aliases: ['autolog'],
    cooldown: 4,
    category: 'logging',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }
        if (!message.guild.me.permissions.has('ADMINISTRATOR')) { 
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            })
        }

        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }
        let data = await client.db.get(`logs_${message.guild.id}`)
        if(!data){
            await client.db.set(`logs_${message.guild.id}`,{ 
                voice : null,
                channel : null,
                rolelogs : null,
                modlogs : null,   
                message : null,
                memberlogs : null
            })
            const initialMessage = await message.channel.send({
                embeds: [new MessageEmbed().setColor(client.color).setDescription('<a:Tick:1306038825054896209>Configuring your server...')],
              });
              await client.util.sleep(2000);
              initialMessage.edit({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.color)
                    .setTitle('<a:Tick:1306038825054896209>Server Configuration Successful')
                    .setDescription('<a:Tick:1306038825054896209>Your server has been successfully configured for logging.')
                    .setFooter({ text: '<a:Tick:1306038825054896209>Your server has been successfully configured for logging Run Command Again.!'})
                ],
              });
                      } 
        if(data.modlogs || data.memberlogs || data.message || data.channel || data.rolelogs || data.voice ){

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setTitle('Logging System is Already Set Up')
                        .setDescription('Your server already has a configured logging system.')
                        .addField('How to Reset Logging?', 'You can manage logging settings using the appropriate commands.')
                        .setFooter(`Note : If you wannna setup logging again use ${message.guild.prefix}logsreset & delete all existinglog channels of FlaMe-Advance`, client.user.displayAvatarURL())
                ]
            });
            
                      
            } 


        try {
            let category = message.guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === 'FlaMe-Advance-LOGS');

            if (!category) {
                category = await message.guild.channels.create('FlaMe-Advance-LOGS', {
                    type: 'GUILD_CATEGORY',
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL']
                        }
                    ]
                });
            }

            const channels = [
                { name: 'voicelogs', topic: 'This channel logs voice-related events.' },
                { name: 'channellogs', topic: 'This channel logs channel-related events.' },
                { name : 'rolelogs', topic: 'This channel logs role-related events.'},
                { name: 'modlogs', topic: 'This channel logs moderation events.' },
                { name: 'msglogs', topic: 'This channel logs message events.' },
                { name: 'memberlogs', topic: 'This channel logs member-related events.' },
            ];
            for (const channelData of channels) {
                    let check = await message.guild.channels.cache.find(ch => ch.name === channelData.name);
                    if (check) { 
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setTitle('Logging System is Already Set Up')
                                    .setDescription('Your server already has a configured logging system.')
                                    .addField('How to Reset Logging?', 'You can manage logging settings using the appropriate commands.')
                                    .setFooter(`Note : If you wannna setup logging again use ${message.guild.prefix}logsreset & delete all existinglog channels of FlaMe-Advance`, client.user.displayAvatarURL())
                            ]
                        });
                    }
                
                await client.util.sleep(2000)
                await message.guild.channels.create(channelData.name, {
                    type: 'GUILD_TEXT',
                    topic: channelData.topic,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ['VIEW_CHANNEL']
                        }
                    ],
                    reason: 'Creating logging channels as part of autologs setup.'
                });
            }
let voicelogs = await message.guild.channels.cache.find(channel => channel.name === 'voicelogs')
let channellogs = await message.guild.channels.cache.find(channel => channel.name === 'channellogs')
let rolelogs = await message.guild.channels.cache.find(channel => channel.name === 'rolelogs')
let modlogs = await message.guild.channels.cache.find(channel => channel.name === 'modlogs')
let msglogs = await message.guild.channels.cache.find(channel => channel.name === 'msglogs')
let memberlogs = await message.guild.channels.cache.find(channel => channel.name === 'memberlogs')

    await client.db.set(`logs_${message.guild.id}`,{ 
        voice : voicelogs.id,
        channel : channellogs.id,
        rolelogs : rolelogs.id,
        modlogs : modlogs.id,   
        message : msglogs.id,
        memberlogs : memberlogs.id
    })
    
    return message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor(client.color)
                .setTitle('Logging Channels Setup Complete')
                .setDescription('All necessary logging channels have been successfully created under the "FlaMe-Advance LOGS" category.')
                .addField('Channels Created', '- **modlogs:** Logs moderation-related events.\n- **memberlogs:** Logs member-related events.\n- **msglogs:** Logs message-related events.\n- **channellogs:** Logs channel-related events.\n- **voicelogs:** Logs voice-related events\n- **rolelogs:** Logs role-related events.')
                .addField('Additional Configuration', 'You can further customize logging settings and manage permissions as needed.')
        ]
    });
    

        } catch (error) {
            if(error.code === 429) {
                await client.util.handleRateLimit()
            }
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('An error occurred while creating logging channels.')
                ]
            });
        }
    }
};
