const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const bot = new Discord.Client();

bot.once('ready', () => {
	console.log('Bot started');
});

bot.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const command = args.shift().toLowerCase();
	const args = message.content.slice(prefix.length).split(/ +/);

	if (command === `ping`) message.channel.send('pong!');
	else if (command === `beep`) message.channel.send('boop!');

	//Insert module function for message checks here: fn(message)
});

bot.login(token).then(()=>bot.user.setActivity(`${prefix}help`, { type: 'PLAYING' }));
