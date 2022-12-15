import { Identifier, ActionInitOpt } from "./types";
import config, { ConfigParser } from "./configuration";
import { Promisified } from "@/proxy/renderer";
import { ActionManager } from "./action";
import bus from "./event-bus";

const currentProcessIsMain = process.type == "browser";

type Handler1 = () => void;
type Handler2 = (controller: MainController | RenController) => void;

export type Handler = Handler1 | Handler2;

type Args = {
  identifier: Identifier;
  param: any;
  type: ActionInitOpt["actionType"];
  isMain: boolean;
};

export abstract class CommonController {
  config: ConfigParser = config;
  action: ActionManager = new ActionManager(config);

  links: Map<Identifier, Handler>[] = [];
  abstract handle(identifier: Identifier, param: any[]): boolean;

  constructor() {
    this.action.init();
    this.bind();
  }

  get<T>(identifier: Identifier): T {
    return this.config.get(identifier) as T;
  }

  abstract set(identifier: Identifier, value: any): boolean;

  bindLinks(handlers: Map<Identifier, Handler>) {
    this.links.push(handlers);
  }

  handleWithLinks(identifier: Identifier, param: any): boolean {
    if (param != undefined) {
      return false;
    }
    for (const handlers of this.links) {
      if (handlers.has(identifier)) {
        (handlers.get(identifier) as Handler)(this);
        return true;
      }
    }
    return false;
  }

  bind() {
    bus.gon("callback", (args: Args) => {
      const { identifier, param, type: actionType, isMain: fromMain } = args;
      console.debug(
        "action triggered",
        identifier,
        param,
        actionType,
        fromMain,
        currentProcessIsMain
      );
      switch (actionType) {
        case "normal":
        case "param_normal":
          if (
            !(
              this.handleWithLinks(identifier, param) ||
              this.handle(identifier, param)
            ) &&
            fromMain == currentProcessIsMain
          ) {
            //跨进程动作，防止出现回声
            bus.iat("callback", args);
          }
          break;
        case "submenu":
        case "constant":
        case "config":
        case "color_picker":
          this.set(identifier, param);
          break;
        case "multi_select":
          if (param instanceof Array) {
            this.set(identifier, param);
          } else {
            let currentItems = [...this.get<string[]>(identifier)];
            const idx = currentItems.indexOf(param);
            if (idx == -1) {
              currentItems.push(param);
            } else {
              currentItems.splice(idx, 1);
            }
            this.set(identifier, currentItems);
          }
          break;
        case "checkbox":
          if (param == undefined) {
            this.set(identifier, !this.get(identifier));
          } else {
            if (typeof param == "boolean") {
              this.set(identifier, param);
            } else {
              throw `invalid type of param for ${identifier}, the value is ${param}, the type if ${typeof param}`;
            }
          }
          break;
        default:
          throw `Unhandled Action Type <${actionType}>`;
      }
    });
  }
}

export abstract class MainController extends CommonController {}

export abstract class RenController extends CommonController {
  abstract proxy: Promisified<MainController>;
}
