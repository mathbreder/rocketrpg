import {CommandInteraction, Interaction} from "discord.js";
import {Client} from "../types/Client";
import {Command} from "../types/Command";
import {Event} from "../types/Event";

export default class InteractionCreate extends Event {
  name = "interactionCreate";

  run = (interactions: Interaction[]) => {
    interactions.forEach(async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      const commandInteraction = interaction as CommandInteraction;

      const command: Command = this.client.commands.get(
        commandInteraction.commandName
      );

      if (!command) return;

      try {
        await command.executeSlash(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    });
  };

  constructor(client: Client) {
    super(client);
  }
}
