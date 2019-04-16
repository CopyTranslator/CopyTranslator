import { Logger } from "log4js";
import * as lodash from "lodash";
import { Controller } from "./core/controller";
type LODASH = typeof lodash;

declare global {
  namespace NodeJS {
    interface Global {
      controller: Controller;
      logger: Logger;
      NODE_ENV: string;
      ROOT_PATH: string;
      __: LODASH;
    }
  }
}
