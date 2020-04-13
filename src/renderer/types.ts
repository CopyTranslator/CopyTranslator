import { Identifier, MenuActionType, RouteActionType } from "../tools/types";
import { Action } from "./action";
import { ConfigParser } from "../tools/configuration";

export interface Controller {
  set(identifier: Identifier, value: any): void;
  config: ConfigParser;
  get<T>(identifier: Identifier): T;
  getT(): any;
}
