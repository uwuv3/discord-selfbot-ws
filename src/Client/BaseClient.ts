import EventEmitter from "events";
import { REST } from "@discordjs/rest";
import { Gateway } from "./Websocket/Gateway.js";
export type Message = {
  type: "DEBUG" | "WARN" | "INFO" | "ERROR";
  content: string;
};
export class Client extends EventEmitter {
  private gateway: Gateway;
  private rest: REST;

  constructor(private token: string) {
    super({ captureRejections: false });
    this.rest = new REST({ version: "10" }).setToken(this.token);
    this.gateway = new Gateway(this.token, this.rest);
    this.gateway.on("message", (gatewayMessage: Message) =>
      this.handleMessage("GATEWAY", gatewayMessage)
    );
  }
  private handleMessage(from: string, message: Message) {
    switch (message.type) {
      case "DEBUG":
        this.emit("debug", `[${from}] ${message.content}`);
        break;
      case "WARN":
        this.emit("warn", `[${from}] ${message.content}`);
        break;
      case "INFO":
        this.emit("info", `[${from}] ${message.content}`);
        break;
      case "ERROR":
        this.emit("error", `[${from}] ${message.content}`);
        break;
    }
  }
  async connect(): Promise<void> {
    try {
      this.emit("debug", "Starting gateway...");
      await this.gateway.connect();
    } catch (error) {
      this.emit("error", error);
    }
  }

  disconnect(): void {
    this.gateway.disconnect();
  }
}
