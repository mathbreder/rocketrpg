import {Message} from "discord.js";
import {Client} from "../types/Client";
import {Command} from "../types/Command";
import {Event} from "../types/Event";

export default class MessageCreate extends Event {
  name = "messageCreate";

  run = (messages: Message[]) => {
    messages.forEach(async (message: Message) => {
      if (!this.isCommand(message.content)) return;

      const command: Command = this.client.commands.find(
        (command) =>
          command.name === this.getCommand(message.content) ||
          command.aliases.includes(this.getCommand(message.content))
      );

      if (!command) return;

      try {
        await command.execute(message);
      } catch (error) {
        console.error(error);
        await message.reply({
          content: "There was an error while executing this command!",
        });
      }
    });
  };

  constructor(client: Client) {
    super(client);
  }

  private isCommand(message: string): boolean {
    return (
      message.startsWith("/") &&
      this.client.commands.find(
        (command) =>
          command.name === this.getCommand(message) ||
          command.aliases.includes(this.getCommand(message))
      ) != undefined
    );
  }

  private getCommand(message: string): string {
    return message?.split(" ")?.[0]?.slice(1);
  }
}
