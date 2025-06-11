import { ConfigManager } from "../../Client/Config/ConfigManager.js";
export type ConfigData = {
  eulaAccept: boolean;
  port: number | any;
};
export class Config {
  private data = new Map<keyof ConfigData, ConfigData[keyof ConfigData]>();

  constructor(private manager: ConfigManager) {}

  get<K extends keyof ConfigData>(key: K): ConfigData[K] | undefined {
    return this.data.get(key);
  }

  set<K extends keyof ConfigData>(key: K, value: ConfigData[K]): this {
    this.data.set(key, value);
    this.manager.syncSave();
    return this;
  }

  has<K extends keyof ConfigData>(key: K): boolean {
    return this.data.has(key);
  }

  delete<K extends keyof ConfigData>(key: K): boolean {
    const result = this.data.delete(key);
    if (result) {
      this.manager.syncSave();
    }
    return result;
  }

  clear(): this {
    this.data.clear();
    this.manager.syncSave();
    return this;
  }

  toObject(): Partial<ConfigData> {
    return Object.fromEntries(this.data);
  }

  fromObject(obj: Partial<ConfigData>): this {
    this.data = new Map(
      Object.entries(obj) as [keyof ConfigData, ConfigData[keyof ConfigData]][]
    );
    return this;
  }

  size(): number {
    return this.data.size;
  }

  keys(): IterableIterator<keyof ConfigData> {
    return this.data.keys();
  }

  values(): IterableIterator<ConfigData[keyof ConfigData]> {
    return this.data.values();
  }

  entries(): IterableIterator<
    [keyof ConfigData, ConfigData[keyof ConfigData]]
  > {
    return this.data.entries();
  }
}
