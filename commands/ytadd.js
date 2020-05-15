const Discord = require('discord.js');
const config = require('../config.json');
const {google} = require('googleapis');
const youtube = google.youtube({
    version: 'v3',
    auth: config.youtube.key,
});

module.exports = {
	name: 'ytadd',
	description: 'Add YouTube RSS Feed',    
	execute(message, args) {
        const origMatch =(/.*youtube\.com\/channel\/(.+)/.exec(message.content)); //Regex for match both channel and user: (/.*youtube\.com\/.+\/(.+)/.exec(message.content));
        
        if(origMatch != null){
            addYtFeed(origMatch[1],message);
            return;
        }

        youtube.search.list({
            type: 'channel',
            part: 'id,snippet',
            q: message.content.split(/ (.+)/)[1],
        }).then(res => {
            const numToEmoji = [':one:',':two:',':three:',':four:',':five:']
        
            var msgEmbed = new Discord.MessageEmbed()
                .setColor(3447003)
                .setTitle('Chanels Found')
                .setDescription('Enter the corresponding channel number')
                .setTimestamp()
                .setFooter('© 8059 Blank.');
        
            for (var i in res.data.items){
                msgEmbed.addField(numToEmoji[i],`${res.data.items[i].snippet.title}\n${res.data.items[i].snippet.description}\nhttps://youtube.com/channel/${res.data.items[i].snippet.channelId}`);
            }
        
            message.channel.send(msgEmbed);
            message.channel.send(`<@${message.author.id}> Please enter the corresponding channel number`);
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max: 1, time: 10000 });
            collector.on('collect', m => {
                if (m.content >= 1 && m.content <= res.data.items.length) {
                    addYtFeed(res.data.items[m.content-1].snippet.channelId,message);
                } else {
                    message.channel.send(`<@${message.author.id}> Invalid input. Exiting...`);
                }
            });
            collector.on('end',(c,r)=>{
                if(r==='time') message.channel.send(`<@${message.author.id}> Session timed out. Please try running the command again.`);
            });			
        })
        .catch(error => {
            message.channel.send('Oopsie! An error occured. Please check with your friendly bot devs.')
            console.error(error);
        });
	},
};

function addYtFeed(channelId,message){
    //console.log(channelId);
    message.channel.send(`<@${message.author.id}> Added https://youtube.com/channel/${channelId}`);
}