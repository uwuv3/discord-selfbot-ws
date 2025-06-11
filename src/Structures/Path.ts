import path from "path";
import os from "os";
export const Paths = {
  dataFolder: path.join(os.homedir(), "owofarm"),
  dataFile: "userdata",
  configFile: "config",
  tempFile: "temp",
};
