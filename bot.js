const Discord = require('discord.js');
const bot = new Discord.Client();
global.mongoose = require("mongoose");// npm install mongoose 
const fs = require("fs");
let config = require("./config.json"),
    token = config.bot.token,
    prefix = config.bot.prefix,
    dataURL = config.database.dataURL;
mongoose.connect(dataURL, { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true })
mongoose.connection.on('connected', () => {
    console.log(`[MONGO] Connected`)
})
global.User = require("./schemas/user");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
    if(err) return console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile <= 0){
        return console.log(`[LOGS] Нет команд для загрузки`)
    };
    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`)
        console.log(`${i + 1}.${f} Загружен!`)
        bot.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});
bot.on('ready', () => {
  console.log(`Запустился бот ${bot.user.tag}!`);
  bot.generateInvite("ADMINISTRATOR").then((link) => {
      console.log(link)
  })
});

bot.on('message', async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    let userDB = await User.findOne({ guildID: message.guild.id, userID: message.author.id })
    if(!userDB){
        User.create({ guildID: message.guild.id, userID: message.author.id })
    }
    let messageArray = message.content.split(" ");
    let command = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(command.slice(prefix.length)) || bot.commands.get(bot.aliases.get(command.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)
});

bot.login(token);