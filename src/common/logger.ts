const logger = require("electron-log");
import eventBus from "./event-bus";

export function initLog() {
  logger.toast = (text: string) => {
    eventBus.at("dispatch", "toast", text);
  };
  Object.assign(console, logger.functions);
}
export default logger;
