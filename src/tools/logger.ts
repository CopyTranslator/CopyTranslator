let logger = require("log4js").getLogger();
logger.level = process.env.NODE_ENV !== "production" ? "debug" : "warn"; // default level is OFF - which means no logs at all.

export { logger };
