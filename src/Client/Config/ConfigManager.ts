import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { UserConfig, UserData } from "../../Structures/Config/UserConfig.js";
import { Temp } from "../../Structures/Config/Temp.js";
import { Config, ConfigData } from "../../Structures/Config/AppConfig.js";
import { Paths } from "../../Structures/Path.js";
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

export class ConfigManager {
  private userConfigs = new Map<string, UserConfig>();
  private temp: Temp;
  private appConfig: Config;
  private readonly userConfigPath: string;
  private readonly tempFilePath: string;
  private readonly configFilePath: string;

  constructor(private readonly folderPath: string) {
    if (!folderPath?.trim()) {
      logger.error("folderPath is required and cannot be empty");
    }
    this.userConfigPath = path.join(folderPath, Paths.dataFile);
    this.tempFilePath = path.join(folderPath, Paths.tempFile);
    this.configFilePath = path.join(folderPath, Paths.configFile);
    this.temp = new Temp(this);
    this.appConfig = new Config(this);
    this.ensureDirectoryExists();
    this.loadAllConfigs();
  }

  private ensureDirectoryExists(): void {
    if (!existsSync(this.folderPath)) {
      mkdirSync(this.folderPath, { recursive: true });
    }
  }

  get(user: string): UserConfig {
    if (!this.userConfigs.has(user)) {
      this.userConfigs.set(user, new UserConfig(this, user));
    }
    return this.userConfigs.get(user)!;
  }

  getTemp(): Temp {
    return this.temp;
  }

  getConfig(): Config {
    return this.appConfig;
  }

  has(user: string): boolean {
    return this.userConfigs.has(user);
  }

  delete(user: string): boolean {
    const result = this.userConfigs.delete(user);
    if (result) {
      this.syncSave();
    }
    return result;
  }

  list(): string[] {
    return Array.from(this.userConfigs.keys());
  }

  size(): number {
    return this.userConfigs.size;
  }

  syncSave(): void {
    this.saveUserDataFile();
    this.saveTempFile();
    this.saveConfigFile();
  }

  private loadAllConfigs(): void {
    this.loadUserDataFile();
    this.loadTempFile();
    this.loadConfigFile();
  }

  private loadUserDataFile(): void {
    if (!existsSync(this.userConfigPath)) return;
    try {
      const data = readFileSync(this.userConfigPath);
      const parsed = (
        erlpack ? erlpack.unpack(data) : JSON.parse(data.toString())
      ) as Record<string, UserData>;

      for (const [namespace, configData] of Object.entries(parsed)) {
        const config = new UserConfig(this, namespace);
        config.fromObject(configData);
        this.userConfigs.set(namespace, config);
      }
    } catch (error) {
      logger.debug(`Failed to load user config file: ${error}`);
    }
  }

  private loadTempFile(): void {
    if (!existsSync(this.tempFilePath)) return;
    try {
      const data = readFileSync(this.tempFilePath);
      const parsed = erlpack
        ? erlpack.unpack(data)
        : JSON.parse(data.toString());
      this.temp.fromObject(parsed);
    } catch (error) {
      logger.debug(`Failed to load temp file: ${error}`);
    }
  }

  private loadConfigFile(): void {
    if (!existsSync(this.configFilePath)) return;
    try {
      const data = readFileSync(this.configFilePath, "utf8");
      const parsed = JSON.parse(data) as ConfigData;
      this.appConfig.fromObject(parsed);
    } catch (error) {
      logger.debug(`Failed to load config file: ${error}`);
    }
  }

  private saveUserDataFile(): void {
    try {
      const dataToSave: Record<string, Partial<UserData>> = {};
      for (const [namespace, config] of this.userConfigs) {
        const configData = config.toObject();
        if (Object.keys(configData).length > 0) {
          dataToSave[namespace] = configData;
        }
      }

      const serialized = erlpack
        ? erlpack.pack(dataToSave)
        : Buffer.from(JSON.stringify(dataToSave));
      writeFileSync(this.userConfigPath, serialized);
    } catch (error) {
      logger.error(`Failed to save user data file: ${error}`);
    }
  }

  private saveTempFile(): void {
    try {
      const tempData = this.temp.toObject();
      const serialized = erlpack
        ? erlpack.pack(tempData)
        : Buffer.from(JSON.stringify(tempData));
      writeFileSync(this.tempFilePath, serialized);
    } catch (error) {
      logger.error(`Failed to save temp file: ${error}`);
    }
  }

  private saveConfigFile(): void {
    try {
      const configData = this.appConfig.toObject();
      const jsonData = JSON.stringify(configData, null, 0);
      writeFileSync(this.configFilePath, jsonData, "utf8");
    } catch (error) {
      logger.error(`Failed to save config file: ${error}`);
    }
  }
}
