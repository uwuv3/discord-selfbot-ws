import express from "express";
import { handleRouter } from "./Routes/handler.js";
import { logger } from "../Structures/Logger.js";
export class Webserver {
  protected app = express();
  constructor(private port: number = 3000) {
    handleRouter(this.app);
    const listener = this.app.listen(port, () => {
      const addr = listener.address();
      if (addr && typeof addr === "object") {
        let adress = addr?.address;
        if (adress == "::") adress = "localhost";
        logger.info(`Webserver started on http://${adress}:${addr?.port} !`);
      } else {
        logger.info(`Webserver started on http://localhost:${this.port} !`);
      }
    });
  }
}
