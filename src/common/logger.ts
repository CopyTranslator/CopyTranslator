const logger = require("electron-log");
import eventBus from "./event-bus";

export function initLog() {
  logger.toast = (text: string) => {
    eventBus.at("dispatch", "toast", text);
  };
  Object.assign(console, logger.functions);
  const rawWarn = console.warn.bind(console);
  console.warn = (...args: any[]) => {
    const first = args[0];
    const message =
      typeof first === "string"
        ? first
        : first && typeof first.message === "string"
        ? first.message
        : "";
    if (message.includes("[Baidu service]TIMEOUT")) {
      return;
    }
    return rawWarn(...args);
  };
}
export default logger;
