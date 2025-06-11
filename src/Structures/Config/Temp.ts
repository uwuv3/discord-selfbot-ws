import { ConfigManager } from "../../Client/Config/ConfigManager.js";

export class Temp {
  private data = new Map<string, any>();

  constructor(private manager: ConfigManager) {}

  get(key: string): any | undefined {
    return this.data.get(key);
  }

  set(key: string, value: any): this {
    this.data.set(key, value);
    this.manager.syncSave();
    return this;
  }

  has(key: string): boolean {
    return this.data.has(key);
  }

  delete(key: string): boolean {
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

  toObject(): Partial<any> {
    return Object.fromEntries(this.data);
  }

  fromObject(obj: Partial<any>): this {
    this.data = new Map(Object.entries(obj));
    return this;
  }

  size(): number {
    return this.data.size;
  }

  keys(): IterableIterator<string> {
    return this.data.keys();
  }

  values(): IterableIterator<any> {
    return this.data.values();
  }

  entries(): IterableIterator<[string, any]> {
    return this.data.entries();
  }
}
