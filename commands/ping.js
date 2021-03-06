const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let embed = new Discord.MessageEmbed()
        .setColor(`RED`)
        .setTitle(`Название`)
        .setDescription(`Описание`)
        .addField(`Заголовок`,`Содержание`)
    message.channel.send(embed)
};
module.exports.config = {
    name: "ping",
    aliases: ["p"]
};