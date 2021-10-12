// Require dotenv to configure the environment variables
require("dotenv").config();

// Require the necessary discord.js classes
import {CommandInteraction, Intents, Interaction} from "discord.js";

import {join} from "path";
import {Command} from "./types/Command";
import {Client} from "./types/Client";

// Load the token from environment variable
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const testGuildId = process.env.GUILD_ID;

// Create a new client instance
const client = new Client(
  {intents: [Intents.FLAGS.GUILDS]},
  join(__dirname, "commands"),
  join(__dirname, "events"),
  token,
  clientId,
  testGuildId
);
