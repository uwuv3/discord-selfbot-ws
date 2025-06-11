import { Client } from "./Client/BaseClient.js";
import { ConfigManager } from "./Client/Config/ConfigManager.js";
import { logger } from "./Structures/Logger.js";
import { Paths } from "./Structures/Path.js";
import { Webserver } from "./Webserver/WebserverManager.js";

const configManager = new ConfigManager(Paths.dataFolder);
const webserver = new Webserver(configManager.getConfig().get("port"));
const client = new Client(
  "MTExMjk0NTAxNTEzMjUzNjk0Mw.GptWdW.i_uAEChFaCVHTalngN8fzOQ3vUNdp"
);

client.on("warn", logger.warn.bind(logger));
client.on("error", logger.error.bind(logger));
client.on("debug", logger.debug.bind(logger));
client.on("info", logger.info.bind(logger));
client.emit("info", "INIT");
client.connect();
