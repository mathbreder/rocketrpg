import {isAllNotNull, logger, rpgDiceRoller} from "../../utils";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {CommandInteraction, Message, MessageEmbed} from "discord.js";

import {Command} from "../../types/Command";
import {Client} from "../../types/Client";

export default class Roll extends Command {
  name = "r";
  visible = false;
  description = "Rolls a dice";
  information = "";
  aliases: string[] = ["roll"];
  args = false;
  usage = "/r [n of dices]d[n of faces]";
  example = "/r 1d6";
  cooldown = "0";
  category = "general";
  guildOnly = false;
  testing = false;

  diceLibrary = rpgDiceRoller;

  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  embed = (titulo: string, descricao: string) =>
    new MessageEmbed()
      .setColor("#b20c6e")
      .setTitle(titulo)
      .setDescription(descricao);

  constructor(client: Client) {
    super(client);
    this.data.addStringOption(this.diceOption);
    this.data.addStringOption(this.libOption);
  }

  execute = (message: Message): Promise<Message> => {
    try {
      const username = message.author.username;
      const dice = message.content.match(/\/[a-z]+\s(.*)/)?.[1];
      const reply = this.rollDice(username, dice);
      return message.reply({embeds: [reply]});
    } catch (error) {
      const reply = this.errorHandling(error);
      return message.reply({embeds: [reply]});
    }
  };
  executeSlash = (interaction: CommandInteraction): Promise<void> => {
    try {
      const username = interaction?.user?.username;
      const dice = interaction.options.getString("dice");
      const reply = this.rollDice(username, <string>dice);
      return interaction.reply({embeds: [reply]});
    } catch (error) {
      const reply = this.errorHandling(error);
      return interaction.reply({embeds: [reply]});
    }
  };

  private errorHandling(error: any): MessageEmbed {
    logger.error(error);
    return this.embed(
      `Rolagem inválida :(`,
      `Tente colocar as informações do dado sem espaço. ` +
        `Ex: \`1d6\` ao invés de \`1 d6\` ou \`1d 6\`.\n` +
        `Use \`/help roll\` para saber como usar a rolagem de dados.`
    );
  }

  private diceOption(
    builder: SlashCommandStringOption
  ): SlashCommandStringOption {
    builder.setName("dice");
    builder.setDescription(
      "Dice to roll. Format: [n of dices]d[n of faces]. Ex.: 1d6"
    );
    builder.setRequired(true);
    return builder;
  }

  private libOption(
    builder: SlashCommandStringOption
  ): SlashCommandStringOption {
    builder.setName("library");
    builder.setDescription("Library to be used to generate the dice rolling.");
    // builder.addChoices([
    //   ["primary", "rdr"],
    // ]);
    builder.setRequired(false);
    return builder;
  }

  private setDiceLibrary(library: string): void {
    if (!isAllNotNull(library)) return;

    if (library === "rdr") this.diceLibrary = rpgDiceRoller;
  }

  private getFace(diceResult: string): string {
    if (diceResult.includes("69")) return "( ͡° ͜ʖ ͡°)";
    else return ":)";
  }

  private rollDice(username: string, dice: string): MessageEmbed {
    if (!isAllNotNull(dice) || dice.length === 0)
      throw new Error("Sem argumento de dado para rolagem");
    const diceRoll = this.diceLibrary.rollDice(dice);
    return this.embed(
      `${username} rolou ${dice}`,
      `O resultado foi **${diceRoll}** ${this.getFace(diceRoll)}`
    );
  }
}
