import {isAllNotNull, logger, rpgDiceRoller} from "../../utils";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {CommandInteraction, Message, MessageEmbed} from "discord.js";

import {Command} from "../../types/Command";
import {Client} from "../../types/Client";

export default class Roll extends Command {
  name = "roll";
  visible = false;
  description = "Rolls a dice";
  information = "";
  aliases: string[] = ["r"];
  args = false;
  usage = "/roll [n of dices]d[n of faces]";
  example = "/roll 1d6";
  cooldown = "0";
  category = "general";
  guildOnly = false;
  testing = true;

  diceLibrary = rpgDiceRoller;

  data: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);

  embed = (
    username: string,
    rolagem: string | number | boolean,
    resultado: string
  ) =>
    new MessageEmbed()
      .setColor("#b20c6e")
      .setTitle(`${username} rolou ${rolagem}`)
      .setDescription(
        `O resultado foi **${resultado}** ${this.getFace(resultado)}`
      );

  constructor(client: Client) {
    super(client);
    this.data.addStringOption(this.diceOption);
    this.data.addStringOption(this.libOption);
  }

  execute = (message: Message): Promise<Message> => {
    return message.channel.send("Please use the slash command.");
  };
  executeSlash = (interaction: CommandInteraction): Promise<void> => {
    try {
      const reply = this.rollDice(interaction);
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
      username,
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

  private rollDice(interaction: CommandInteraction): MessageEmbed {
    const username = interaction?.user?.username;
    const dice = interaction.options.get("dice")?.value;
    const diceRoll = this.diceLibrary.rollDice(dice);
    return this.embed(username, dice, diceRoll);
  }
}
