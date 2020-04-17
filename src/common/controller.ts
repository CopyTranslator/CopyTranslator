import { Identifier } from "./types";
import config, { ConfigParser } from "./configuration";
import { Promisified } from "@/proxy/renderer";
import { ActionManager } from "./action";
import bus from "./event-bus";
const isMain = process.type == "browser";

export abstract class CommonController {
  config: ConfigParser = config;
  action: ActionManager = new ActionManager(config);
  abstract handle(command: string): boolean;

  constructor() {
    this.action.init();
    this.bind();
  }

  get<T>(identifier: Identifier): T {
    return this.config.get(identifier) as T;
  }

  set(identifier: Identifier, value: any): boolean {
    return this.config.set(identifier, value);
  }

  bind() {
    bus.gon("callback", (args: any) => {
      const { identifier, param, type, isMain: main } = args;
      switch (type) {
        case "normal":
          if (!this.handle(identifier) && main == isMain) {
            //跨进程动作，防止出现回声
            bus.iat("callback", args);
          }
          break;
        case "submenu":
        case "constant":
          this.set(identifier, param);
          break;
        case "checkbox":
          if (param == undefined) {
            this.set(identifier, !this.get(identifier));
          } else {
            this.set(identifier, param);
          }
          break;
      }
    });
  }
}

export abstract class MainController extends CommonController {}

export abstract class RenController extends CommonController {
  abstract proxy: Promisified<MainController>;
}
