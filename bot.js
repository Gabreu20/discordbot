const Discord = require('discord.js');
const client = new Discord.Client();
const DisTube = require('distube');
const distube = new DisTube(client, {searchSongs: false, emitNewSongOnly: true });
const { token } = require('./info.json');
const prefix = ".";
require('dotenv/config');

function ligar(){
  client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`);
  });
  
  client.on('message', async (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
      if(command == "p" || command == "play"){
          if(!message.member.voice.channel) return message.channel.send("Você num ta numa sala animal.");
          if(!args[0]) return message.channel.send("Tem que escolher uma musica pra tocar");
          distube.play(message, args.join(" "));
      }
      if(command == "stop"){
        const bot = message.guild.members.cache.get(client.user.id);
        if(!message.member.voice.channel) return message.channel.send("Você num ta numa sala animal.");
        if(bot.voice.channel !== message.member.voice.channel) return message.channel.send("Tem q ta na mesma sala que o bot");
        distube.stop(message);
        message.channel.send("Parou a musica");
      }
      if(command == "skip"){
        distube.skip(message);
        message.channel.send("Pulando...");
      }
      if(command == "aipapai"){
        message.channel.send("Meteu Essa?");
      }
          
  });
    // Queue status template
    const status = (queue) => ""/*`Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``*/;
  
   // DisTube event listeners, more in the documentation page
   distube
   .on("playSong", (message, queue, song) => message.channel.send(
     `Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nA pedido de: ${song.user}\n${status(queue)}`
   ))
   .on("addSong", (message, queue, song) => message.channel.send(
     `${song.user} adicionou ${song.name} - \`${song.formattedDuration}\` na playlist!`
   ))
   .on("playList", (message, queue, playlist, song) => message.channel.send(
     `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
   ))
   .on("addList", (message, queue, playlist) => message.channel.send(
     `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
   ))
   // DisTubeOptions.searchSongs = true
   .on("searchResult", (message, result) => {
     let i = 0;
     message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
   })
   // DisTubeOptions.searchSongs = true
   .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
   .on("error", (message, e) => {
     console.error(e)
     message.channel.send("An error encountered: " + e);
   });
  
  
  client.login(token);  
}
