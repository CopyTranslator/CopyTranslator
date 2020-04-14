import { Identifier, MenuActionType, RouteActionType } from "../common/types";
import { Action } from "./action";
import { ConfigParser } from "../common/configuration";

export interface Controller {
  set(identifier: Identifier, value: any): void;
  config: ConfigParser;
  get<T>(identifier: Identifier): T;
  getT(): any;
}
