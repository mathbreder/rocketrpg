import {Client} from "./Client";

export abstract class Event {
  client: Client;
  once: boolean = false;
  abstract run: (args?: any) => void;

  constructor(client: Client) {
    this.client = client;
  }
}
