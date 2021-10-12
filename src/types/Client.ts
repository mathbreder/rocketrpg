import {Routes} from "discord-api-types/v9";
import {
  Client as DiscordClient,
  ClientOptions,
  Collection,
  Intents,
} from "discord.js";
import {Command} from "./Command";

import {REST} from "@discordjs/rest";

import {readdirSync, statSync} from "fs";
import {join} from "path";
import {Event} from "./Event";
import {isAllNotNull, logger} from "../utils";

type DirFile = {
  dir: string;
  file: string;
};

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  slashCommands: Collection<string, Command>;
  prefixes: {[key: number]: string};
  token: string;
  clientId: string;
  testGuildId: string;

  /**
   * Construct a instance of the Discord Client, reading the commands and events and registering it.
   *
   * @param clientOptions the options to configure the client.
   * @param commandsPath the path from root to the commands directory.
   * @param eventsPath the path from root to the events directory.
   * @param token the token to login the bot.
   * @param testGuildId the guildId to test the bot.
   */
  public constructor(
    clientOptions: ClientOptions,
    commandsPath: string,
    eventsPath: string,
    token?: string,
    clientId?: string,
    testGuildId?: string
  ) {
    super(clientOptions);
    this.commands = new Collection<string, Command>();
    this.slashCommands = new Collection<string, Command>();
    this.prefixes = {};
    this.token = token;
    this.clientId = clientId;
    this.testGuildId = testGuildId;

    this.loadCommands(commandsPath).then((comms) => {
      const testCommands: Collection<string, Command> = comms.filter(
        (comm: Command) => comm.testing
      );
      const globalCommands: Collection<string, Command> = comms.filter(
        (comm: Command) => !comm.testing
      );
      this.registerGuildCommand(rest, testCommands);
      this.registerGlobalCommand(rest, globalCommands);
    });
    this.loadEvents(eventsPath);
    isAllNotNull(token) && this.login();

    const rest = new REST({version: "9"}).setToken(token);
  }

  /**
   * Read the dirs and list files to import
   *
   * @param path the path to read
   * @returns the list of file names and path
   */
  private readFiles(path: string): DirFile[] {
    const files: DirFile[] = [];

    readdirSync(path).forEach((dirOrFile) => {
      if (statSync(join(path, dirOrFile)).isDirectory()) {
        files.push(...this.readFiles(join(path, dirOrFile)));
      } else if (
        statSync(join(path, dirOrFile)).isFile() &&
        (dirOrFile.endsWith(".js") || dirOrFile.endsWith(".ts"))
      ) {
        const file: DirFile = {dir: path, file: dirOrFile};
        files.push(file);
      }
    });

    return files;
  }

  /**
   * Load the command handlers
   *
   * @param commandsPath the command files path
   */
  private async loadCommands(commandsPath: string) {
    // Load all the commands
    const commandFiles = this.readFiles(commandsPath);

    for (const {dir, file} of commandFiles) {
      try {
        const FoundCommand = await import(join(dir, file));
        const command: Command = new FoundCommand.default(this);

        console.log(`Loaded command ${join(dir, file)}`);
        this.commands.set(command.name, command);

        // Slash commands
        if (command.data !== null) {
          this.slashCommands.set(command.name, command);
        }
      } catch (error) {
        console.log(`Can't load command ${join(dir, file)}`);
        logger.error(error);
      }
    }

    return this.commands;
  }

  /**
   * Load the event handlers
   *
   * @param eventsPath the path to the events handling files
   */
  private loadEvents(eventsPath: string): void {
    // Load all the events
    const eventFiles = this.readFiles(eventsPath);

    for (const {dir, file} of eventFiles) {
      import(join(dir, file))
        .then(({default: FoundEvent}) => {
          const event: Event = new FoundEvent(this);

          console.log(`Loaded event ${join(dir, file)}`);

          const eventFileName = file.split(".")[0];
          const eventName =
            eventFileName.charAt(0).toLowerCase() + eventFileName.slice(1);

          if (event.once) {
            this.once(eventName, (...args: unknown[]) => {
              event.run(args);
            });
          } else {
            this.on(eventName, (...args: unknown[]) => {
              event.run(args);
            });
          }
        })
        .catch((error) => console.error(error));
    }
  }

  private registerGuildCommand(
    rest: REST,
    commands: Collection<string, Command>
  ) {
    const jsonCommands = commands.map((command) => command.data.toJSON());
    rest
      .put(Routes.applicationGuildCommands(this.clientId, this.testGuildId), {
        body: jsonCommands,
      })
      .then(() =>
        console.log("Successfully registered guild application commands.")
      )
      .catch(console.error);
  }

  private registerGlobalCommand(
    rest: REST,
    commands: Collection<string, Command>
  ) {
    const jsonCommands = commands.map((command) => command.data.toJSON());
    rest
      .put(Routes.applicationCommands(this.clientId), {body: jsonCommands})
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);
  }
}
