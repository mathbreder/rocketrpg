import {logger} from "../../utils";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, Message, MessageEmbed} from "discord.js";

import {Command} from "../../types/Command";
import {Client} from "../../types/Client";

export default class Help extends Command {
  name = "help";
  visible = false;
  description = "Show the help message.";
  information = "";
  aliases: string[] = ["h"];
  args = false;
  usage = "/help [command]";
  example = "/help | /help roll";
  cooldown = "0";
  category = "general";
  guildOnly = false;
  testing = true;

  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  embed = (title: string | number | boolean, description: string) =>
    new MessageEmbed()
      .setColor("#0cb26e")
      .setTitle(String(title))
      .setDescription(description);

  constructor(client: Client) {
    super(client);
  }

  execute = (message: Message): Promise<Message> => {
    return message.channel.send("Please use the slash command.");
  };
  executeSlash = (interaction: CommandInteraction): Promise<void> => {
    try {
      const reply = this.generalHelp(interaction);
      return interaction.reply({embeds: [reply]});
    } catch (error) {
      const reply = this.errorHandling(interaction, error);
      return interaction.reply({embeds: [reply]});
    }
  };

  private generalHelp(interaction: CommandInteraction) {
    const username = interaction?.user?.username;
    const title = `Oi, ${username}! Vim te ajudar :)`;
    const description =
      `Você pode me enviar \`/help [nome do comando]\` ` +
      `para obter informações sobre um comando específico!`;
    const reply = this.embed(title, description);
    const fields = [[], [], []];
    this.client.commands.forEach((command) => {
      if (command.name === "help") return;
      if (
        fields[0].length <= fields[1].length &&
        fields[0].length <= fields[2].length
      ) {
        fields[0].push(command.name);
      } else if (fields[1].length <= fields[2].length) {
        fields[1].push(command.name);
      } else {
        fields[2].push(command.name);
      }
    });
    reply.addFields(
      {name: "Todos os comandos:", value: fields[0].join("\n"), inline: true},
      {name: "\u200b", value: fields[1].join("\n"), inline: true},
      {name: "\u200b", value: fields[2].join("\n"), inline: true}
    );
    return reply;
  }

  private errorHandling(
    interaction: CommandInteraction,
    error: any
  ): MessageEmbed {
    const username = interaction?.user?.username;
    logger.error(error);
    return this.embed(
      `Algo deu errado, ${username} :(`,
      `Use \`/help ${this.name}\` para saber como usar esse comando.`
    );
  }
}
