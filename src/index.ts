// Require dotenv to configure the environment variables
require("dotenv").config();

// Require the necessary discord.js classes
import {Intents} from "discord.js";

import {join} from "path";
import {Client} from "./types/Client";

var express = require("express");
var app = express();

app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(
    `Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`
  );
  response.sendStatus(200);
});

app.listen(process.env.PORT); // Recebe solicitações que o deixa online

// Load the token from environment variable
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const testGuildId = process.env.GUILD_ID;

// Create a new client instance
new Client(
  {intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]},
  join(__dirname, "commands"),
  join(__dirname, "events"),
  token,
  clientId,
  testGuildId
);
