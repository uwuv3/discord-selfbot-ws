import { REST } from "@discordjs/rest";
import {
  Routes,
  GatewayOpcodes,
  GatewayDispatchEvents,
} from "discord-api-types/v10";
import WebSocket from "ws";
import { WebSocketManager } from "./WebsocketManager.js";
import { EventEmitter } from "events";
import { Message } from "../BaseClient.js";

interface GatewayPayload {
  op: number;
  d?: any;
  s?: number;
  t?: string;
}

export class Gateway extends EventEmitter {
  ws: WebSocket | null = null;
  private rest: REST;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private sessionId: string | null = null;
  private sequenceNumber: number | null = null;
  private gatewayUrl: string | null = null;
  private resumeGatewayUrl: string | null = null;
  private token: string;

  constructor(token: string, rest: REST) {
    super();
    this.token = token;
    this.rest = rest;
  }
  sendLog(message: Message) {
    this.emit("message", message);
  }
  async connect(): Promise<void> {
    try {
      this.gatewayUrl = await this.fetchGatewayURL();

      this.createWebSocketConnection();
    } catch (error) {
      this.sendLog({
        type: "ERROR",
        content: `Error while connecting gateway: ${error}`,
      });
    }
  }

  private async fetchGatewayURL(): Promise<string> {
    const data = (await this.rest.get(Routes.gateway())) as { url: string };
    return data.url;
  }

  private createWebSocketConnection(): void {
    const url = this.resumeGatewayUrl || this.gatewayUrl!;
    this.ws = WebSocketManager.create(url, { v: "10" });
    this.ws.on("open", () => {
      this.sendLog({
        type: "DEBUG",
        content: "WebSocket connection opened",
      });
    });

    this.ws.on("message", (data: Buffer | string) => {
      const payload = WebSocketManager.unpack(data);
      this.handlePacket(payload);
    });

    this.ws.on("close", (code: number, reason: Buffer) => {
      this.sendLog({
        type: "WARN",
        content: `Connection closed: ${code} ${reason.toString()}`,
      });
      if (code !== 1000) {
        setTimeout(() => this.reconnect(), 5000);
      }
    });

    this.ws.on("error", (error: Error) => {
      this.sendLog({
        type: "ERROR",
        content: `Error on websocket connection: ${error}`,
      });
    });
  }

  private handlePacket(payload: GatewayPayload): void {
    const { op, d, s, t } = payload;

    if (s) this.sequenceNumber = s;

    switch (op) {
      case GatewayOpcodes.Hello:
        this.handleHello(d);
        break;
      case GatewayOpcodes.Dispatch:
        this.handleDispatch(t!, d);
        break;
      case GatewayOpcodes.Heartbeat:
        this.sendHeartbeat();
        break;
      case GatewayOpcodes.Reconnect:
        this.reconnect();
        break;
      case GatewayOpcodes.InvalidSession:
        this.handleInvalidSession(d);
        break;
      case GatewayOpcodes.HeartbeatAck:
        this.sendLog({
          type: "DEBUG",
          content: "Heartbeat acknowledged",
        });
        break;
    }
  }

  private handleDispatch(eventType: string, data: any): void {
    switch (eventType) {
      case GatewayDispatchEvents.Ready:
        this.sendLog({
          type: "INFO",
          content: "Connected to discord",
        });
        this.sessionId = data.session_id;
        this.resumeGatewayUrl = data.resume_gateway_url;
        break;
    }
  }

  private handleHello(data: { heartbeat_interval: number }): void {
    this.sendLog({
      type: "DEBUG",
      content: "Client Hello",
    });
    this.startHeartbeat(data.heartbeat_interval);

    if (this.sessionId && this.resumeGatewayUrl) {
      this.resume();
    } else {
      this.identify();
    }
  }

  private handleInvalidSession(canResume: boolean): void {
    if (canResume && this.sessionId) {
      setTimeout(() => this.resume(), 1000 + Math.random() * 4000);
    } else {
      this.sessionId = null;
      this.resumeGatewayUrl = null;
      setTimeout(() => this.identify(), 1000 + Math.random() * 4000);
    }
  }

  private identify(): void {
    const payload = {
      op: GatewayOpcodes.Identify,
      d: {
        token: this.token,
        properties: {
          os: "android",
          browser: "chrome",
          device: "Android",
        },
        compress: false,
        large_threshold: 50,
        presence: {
          afk: false,
        },
      },
    };
    this.sendPacket(payload);
  }

  private resume(): void {
    const payload = {
      op: GatewayOpcodes.Resume,
      d: {
        token: this.token,
        session_id: this.sessionId,
        seq: this.sequenceNumber,
      },
    };
    this.sendPacket(payload);
  }

  private startHeartbeat(interval: number): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, interval);
    this.sendHeartbeat();
  }

  private sendHeartbeat(): void {
    const payload = {
      op: GatewayOpcodes.Heartbeat,
      d: this.sequenceNumber,
    };
    this.sendPacket(payload);
  }

  private sendPacket(payload: any): void {
    if (this.ws && this.ws.readyState === WebSocketManager.OPEN) {
      const data = WebSocketManager.pack(payload);
      this.ws.send(data);
    }
  }

  private async reconnect(): Promise<void> {
    this.sendLog({
      type: "WARN",
      content: "Reconnecting Gateway",
    });
    this.cleanup();

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      setTimeout(() => {
        this.connect();
      }, 1000);
    } catch (error) {
      this.sendLog({
        type: "ERROR",
        content: `Error while reconnecting gateway: ${error}`,
      });
      throw error;
    }
  }

  private cleanup(): void {
    this.sendLog({
      type: "DEBUG",
      content: `Cleaning UP!`,
    });
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect(): void {
    this.cleanup();
    this.sendLog({
      type: "WARN",
      content: `Disconnecting from gateway`,
    });
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
