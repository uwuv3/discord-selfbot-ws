import { ConfigManager } from "../../Client/Config/ConfigManager.js";
export type UserData = {
  id: string;
  token: string;
  displayName: string;
};
export class UserConfig {
  private data = new Map<keyof UserData, UserData[keyof UserData]>();

  constructor(private manager: ConfigManager, private userID: string) {}

  getUserID(): string {
    return this.userID;
  }

  get<K extends keyof UserData>(key: K): UserData[K] | undefined {
    return this.data.get(key);
  }

  set<K extends keyof UserData>(key: K, value: UserData[K]): this {
    this.data.set(key, value);
    this.manager.syncSave();
    return this;
  }

  has<K extends keyof UserData>(key: K): boolean {
    return this.data.has(key);
  }

  delete<K extends keyof UserData>(key: K): boolean {
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

  toObject(): Partial<UserData> {
    return Object.fromEntries(this.data);
  }

  fromObject(obj: Partial<UserData>): this {
    this.data = new Map(
      Object.entries(obj) as [keyof UserData, UserData[keyof UserData]][]
    );
    return this;
  }

  size(): number {
    return this.data.size;
  }

  keys(): IterableIterator<keyof UserData> {
    return this.data.keys();
  }

  values(): IterableIterator<UserData[keyof UserData]> {
    return this.data.values();
  }

  entries(): IterableIterator<[keyof UserData, UserData[keyof UserData]]> {
    return this.data.entries();
  }
}
