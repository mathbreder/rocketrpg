import {Client} from "../types/Client";
import {Event} from "../types/Event";

export default class Ready extends Event {
  name = "ready";
  once = true;
  run = (client: Client[]) => {
    console.log(`Ready! Logged in as ${client[0]?.user?.username}`);
  };

  constructor(client: Client) {
    super(client);
  }
}
