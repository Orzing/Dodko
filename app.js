// Load up the discord.js library
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Need Help? | *help`);
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  	if (command === "help") {
		const embed = new Discord.RichEmbed()
		.setColor(0x1207da)
		.setTitle("Command List:")
		.addField("*membercount", "Check how much people are in the server.")
		.addField("*invite", "Invite The Bot To Your Discord.")
		.addField("*server", "No Server Just Yet.")
        .addField("*suggest", "Add A Suggestion!")
        .addField("*botinfo", "Gives The Bot Information.")
		.addField("*restart", "Restart The Bot.")
		.addField("*tell", "DM Someone Any Message!");
		message.channel.send({embed});
		const otherEmbed = new Discord.RichEmbed()
		.setColor(0x9786F4)
		.setTitle("Moderator Commands:")
		.addField("*kick", "Kick People")
		.addField("*ban", "Ban People")
		.addField("*mute", "Mute People")
		.addField("*unmute", "Unmute Muted People")
		.addField("*warn", "Warn People");
		message.channel.send({embed: otherEmbed});
		const thirdEmbed = new Discord.RichEmbed()
		.setColor(0xaad666)
		.setTitle("Bot Made By Orzing#1171");
		message.channel.send({embed: thirdEmbed});
}

if(command === "membercount") {
    const embed = new Discord.RichEmbed()
		.setColor(0x4ded16)
		.addField("Membercount:",`**${message.guild.members.size}**`)
		message.channel.send({embed})
}

if (command === "invite") {
		const embed = new Discord.RichEmbed()
		.setColor(0xeee646)
		.addField("Invite The Bot To Your Server:", "https://discordapp.com/oauth2/authorize?&client_id=439360130111242240&scope=bot&permissions=0");
		message.channel.send({embed})
}

if (command === "botinfo") {
		const embed = new Discord.RichEmbed()
		.setColor(0xaad666)
		.setTitle("**Bot Info:**")
		.addField("Bot Name:","**Dodko**")
        .addField("Bot Version:", "1.0.0")
        .addField("Created On", "4/27/2018")
		.addField("Created By:", "Orzing#1171");
		message.channel.send({embed})
}

if (command === "server") {
		const embed = new Discord.RichEmbed()
		.setColor(0xeee646)
		.addField("i said,", "**NO SERVER YET!!!**");
		message.channel.send({embed})
}

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");


    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("You Cannot Kick This Member.");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
   if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("You Cannot Ban This Member.");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

 if(command === "purge") {
     message.delete();
     if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you don't have permissions to use this!");
	 if (isNaN(args[0])) return message.reply('Please supply a valid amount of messages to purge');
	 if (args[0] > 100) return message.reply('Please supply a number less then 100');


	 message.channel.bulkDelete(args[0])
		.catch( error => message.channel.send(``));
}

if(command === "restart") {
    const embed = new Discord.RichEmbed()
        .setColor(0xeee646)
        .setTitle("Restarting...");
    message.channel.send({embed})
            .then(client.destroy(config.token))
            .then(client.login(config.token));
    const otherEmbed = new Discord.RichEmbed()
        .setColor(0x3ae907)
        .setTitle("Restarted Successfully! Please Wait A Couple Of Secends...");
    message.channel.send({embed: otherEmbed});
}

if(command === "mute") {
  	    if(!message.member.hasPermission("MUTE_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");
    let rMember = message.mentions.members.first();
    let mRole = message.guild.roles.find(`name`, `mutedRole`);
  	    if(!rMember) return message.reply("Please mention a valid member of this server!");
    if (rMember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot mute this member!");
    let mutereasondelete = 10 + rMember.user.id.length;
      let mutereason = message.content.substring(mutereasondelete).split(" ");
      mutereason = mutereason.join(" ");
      if (!mutereason) return message.reply("Please indicate a reason for the mute!");
    rMember.addRole(mRole.id);

    message.delete().catch(O_o=>{});
    const embed = new Discord.RichEmbed()
        .setColor(0xeee646)
        .addField(`Staff Member:`, `${message.author}`)
        .addField(`Muted`, `${rMember}`)
        .addField(`For`, `${mutereason}`);
    message.channel.send({embed})
}

if(command === "warn") {
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");
    let wMember = message.mentions.members.first();
    let warnReasondelete = 10 + wMember.user.id.length;
    let warnReason = message.content.substring(warnReasondelete).split(" ");
    warnReason = warnReason.join(" ");
    if (!warnReason) return message.reply("Please indicate a reason for the warn!");
    message.delete();
    const embed = new Discord.RichEmbed()
        .setColor(0xeee646)
        .addField(`staff member:`, `${message.author}`)
        .addField(`Warned: `, `${wMember}`)
        .addField(`For`, `${warnReason}`);
    message.channel.send({embed});
    wMember.send(`${wMember}, You have been warned by ${message.author} for ${warnReason}, Ignoring that message may deserve you with a punishment.`);
    //message.channel.send(`${wMember} was warned by ${message.author} for the reason "${warnReason}"`);
}

if(command === "tell") {
    if(!message.member.hasPermission("ADMINSTATOR")) return message.reply("Sorry, you don't have permissions to use this!");
    let tMember = message.mentions.members.first();
    if(!tMember) return message.reply("Please mention a valid member of this server!");
    tMember.send(args.join(" "))
}

if(command === "suggest") {
  	    message.delete();
  	    let args1 = args.join(" ");
    const embed = new Discord.RichEmbed()
        .setColor(0xeee646)
        .setTitle(`Suggestion by ${message.author.username}`)
        .setDescription(args1);
    message.channel.send({embed})
    .then(function (message) {
    message.react("👍");
    message.react("👎");
    if (!args1) return message.reply("Please suggest something!")
})}

    if (command === "unmute") { // creates the command unmute
        if(!message.member.hasPermission("MUTE_MEMBERS")) return message.reply("Sorry, you don't have permissions to use this!");
        let rMember = message.mentions.members.first();
        let mRole = message.guild.roles.find(`name`, `mutedRole`);
        if(!rMember) return message.reply("Please mention a valid member of this server!");
        if (rMember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot unmute this member!");
        rMember.removeRole(mRole.id);

        message.delete().catch(O_o=>{});
        const embed = new Discord.RichEmbed()
            .setColor(0xeee646)
            .addField(`Staff Member:`, `${message.author}`)
            .addField(`unmuted`, `${rMember}`);
        message.channel.send({embed})
    }
});

client.login(config.token);
