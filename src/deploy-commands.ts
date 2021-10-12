// Require dotenv to configure the environment variables
require("dotenv").config();

import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import * as path from "path";

import * as fs from "fs";

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const commands = [];
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, "commands", file.slice(0, -3)));
  commands.push(command.data.toJSON());
  console.log(command);
}

const rest = new REST({version: "9"}).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
