import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {CommandInteraction, Message, MessageEmbed} from "discord.js";

import {Command} from "../../types/Command";
import {Client} from "../../types/Client";
import {logger, rpgDiceRoller} from "../../utils";

export default class ErradoCerto extends Command {
  name = "erradocerto";
  visible = false;
  description = "Comando usado para correção";
  information = "";
  aliases: string[] = ["ec"];
  args = false;
  usage = "/erradoCerto [errado] [certo]";
  example = "/erradoCerto caza casa";
  cooldown = "0";
  category = "general";
  guildOnly = false;
  testing = true;

  diceLibrary = rpgDiceRoller;

  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  embed = (title: string, description: string) =>
    new MessageEmbed()
      .setColor("#b20e0c")
      .setTitle(title)
      .setDescription(description);

  constructor(client: Client) {
    super(client);
    this.data.addStringOption(this.erradoOption);
    this.data.addStringOption(this.certoOption);
  }

  execute = (message: Message): Promise<Message> => {
    return message.channel.send("Please use the slash command.");
  };
  executeSlash = (interaction: CommandInteraction): Promise<void> => {
    try {
      const reply = this.gerarErradoCerto(interaction);
      return interaction.reply({embeds: [reply]});
    } catch (error) {
      const reply = this.errorHandling(interaction, error);
      return interaction.reply({embeds: [reply]});
    }
  };

  private errorHandling(
    interaction: CommandInteraction,
    error: any
  ): MessageEmbed {
    const username = interaction?.user?.username;
    logger.error(error);
    return this.embed(
      `Algo deu errado :(`,
      `Use \`/help ${this.name}\` para saber como usar esse comando.`
    );
  }

  private gerarErradoCerto(interaction: CommandInteraction): MessageEmbed {
    const errado = interaction.options.getString("errado");
    const certo = interaction.options.getString("certo");
    const title = `Algo de errado não está certo, então vim corrigir`;
    const message = `Errado -> ${errado}\nCerto -> ${certo}`;
    const reply = this.embed(title, message);
    return reply;
  }

  private erradoOption(
    builder: SlashCommandStringOption
  ): SlashCommandStringOption {
    builder.setName("errado");
    builder.setDescription("Palavra errada");
    builder.setRequired(true);
    return builder;
  }

  private certoOption(
    builder: SlashCommandStringOption
  ): SlashCommandStringOption {
    builder.setName("certo");
    builder.setDescription("Palavra certa");
    builder.setRequired(true);
    return builder;
  }
}
