import { Identifier } from "./types";
import config, { ConfigParser } from "./configuration";
import { Promisified } from "@/proxy/renderer";
import { ActionManager } from "./action";
import bus from "./event-bus";
const isMain = process.type == "browser";

type Handler1 = () => void;
type Handler2 = (controller: MainController | RenController) => void;
export type Handler = Handler1 | Handler2;

export abstract class CommonController {
  config: ConfigParser = config;
  action: ActionManager = new ActionManager(config);

  links: Map<Identifier, Handler>[] = [];
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

  bindLinks(handlers: Map<Identifier, Handler>) {
    this.links.push(handlers);
  }

  handleWithLinks(identifier: Identifier): boolean {
    for (const handlers of this.links) {
      if (handlers.has(identifier)) {
        (handlers.get(identifier) as Handler)(this);
        return true;
      }
    }
    return false;
  }

  bind() {
    bus.gon("callback", (args: any) => {
      const { identifier, param, type, isMain: main } = args;
      switch (type) {
        case "normal":
          if (
            !(this.handleWithLinks(identifier) || this.handle(identifier)) &&
            main == isMain
          ) {
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
