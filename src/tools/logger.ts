import { Logger, getLogger } from "log4js";
var instance: Logger | undefined = undefined;
export function log(): Logger {
  if (!instance) {
    instance = getLogger();
    instance.level = process.env.NODE_ENV !== "production" ? "debug" : "warn"; // default level is OFF - which means no logs at all.
  }
  return instance;
}
