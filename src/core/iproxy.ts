import { Identifier, MenuActionType } from "../tools/types";
import { Action } from "../tools/action";
import { Rectangle } from "electron";

export interface IProxy {
  capture(): void;
  set(
    identifier: Identifier,
    value: any,
    save: boolean,
    refresh: boolean
  ): void;
  get(identifier: Identifier): any;
  handleAction(cmd: string): void;
  getSupportLanguages(): void;
  getAction(identifier: Identifier): Action;
  setCurrentColor(): void;
  setUpRecognizer(APP_ID: string, API_KEY: string, SECRET_KEY: string): void;
  getKeys(routeName: MenuActionType): Identifier[];
  tryTranslate(text: string, clear: boolean): void;
  routeTo(routerName: string): void;
  popup(id: MenuActionType): void;
  saveWindow(routeName: Identifier, bound: Rectangle, fontSize: number): void;
  getBound(): Rectangle;
  restoreWindow(routeName: Identifier | undefined): void;
  checkSync(): void;
}
