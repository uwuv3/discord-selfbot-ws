import { Buffer } from "node:buffer";
import WebSocket from "ws";
import { logger } from "../../Structures/Logger.js";
import Module from "node:module";

const require = Module.createRequire(import.meta.url);
let erlpack: any;
try {
  erlpack = require("erlpack");
} catch (err) {
  logger.debug("Erlpack not found" + err);
  erlpack = null;
}

export class WebSocketManager {
  static WebSocket = WebSocket;
  static CONNECTING = WebSocket.CONNECTING;
  static OPEN = WebSocket.OPEN;
  static CLOSING = WebSocket.CLOSING;
  static CLOSED = WebSocket.CLOSED;
  private static textDecoder = new TextDecoder();
  static encoding = erlpack ? "etf" : "json";

  static pack(data: any): string | Buffer {
    return erlpack ? erlpack.pack(data) : JSON.stringify(data);
  }

  static unpack(data: string | Buffer | ArrayBuffer, type?: string): any {
    if (this.encoding === "json" || type === "json") {
      if (typeof data !== "string") {
        data = this.textDecoder.decode(data as ArrayBuffer);
      }
      return JSON.parse(data as string);
    }

    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(new Uint8Array(data as ArrayBuffer));
    }
    return erlpack.unpack(data);
  }

  static create(
    gateway: string,
    query: Record<string, any> = {},
    ...args: any[]
  ): WebSocket {
    const [g, q] = gateway.split("?");
    query.encoding = this.encoding;
    const queryParams = new URLSearchParams(query);
    if (q) {
      new URLSearchParams(q).forEach((v, k) => queryParams.set(k, v));
    }
    return new this.WebSocket(`${g}?${queryParams}`, ...args);
  }
}
