import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, Message} from "discord.js";

import {Command} from "../../types/Command";

export default class Ping extends Command {
  name = "ping";
  visible = false;
  description = 'Sends back "Pong!" and the latency of user from bot server';
  information = "";
  aliases: string[] = [];
  args = false;
  usage = "";
  example = "";
  cooldown = "0";
  category = "general";
  guildOnly = false;

  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  execute = (message: Message): Promise<Message> => {
    return message.channel.send("Please use the slash command.");
  };
  executeSlash = (interaction: CommandInteraction): Promise<void> => {
    return interaction.reply(this.ping(interaction.createdTimestamp));
  };

  private ping(startTime: number): string {
    const ping = Date.now() - startTime;
    return `Pong! Your ping is **${ping} ms**`;
  }
}
