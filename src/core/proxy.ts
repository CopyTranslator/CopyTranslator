import { IProxy } from "./iproxy";
import { Controller } from "./controller";
import { Identifier, MenuActionType, RouteActionType } from "../tools/types";
import { handleActions } from "./actionCallback";
import { Action } from "../tools/action";
import { Rectangle } from "electron";

export class Proxy implements IProxy {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  capture() {
    global.shortcutCapture.shortcutCapture();
  }

  set(
    identifier: Identifier,
    value: any,
    save: boolean,
    refresh: boolean
  ): void {
    this.controller.set(identifier, value, save, refresh);
  }

  get(identifier: Identifier) {
    return this.controller.get<any>(identifier);
  }

  handleAction(cmd: string) {
    handleActions(cmd);
  }

  getSupportLanguages() {
    this.controller.translator.getSupportLanguages();
  }

  getAction(identifier: Identifier): Action {
    return this.controller.action.getAction(identifier);
  }

  setCurrentColor() {
    this.controller.setCurrentColor();
  }

  getKeys(routeName: MenuActionType): Identifier[] {
    return this.controller.action.getKeys(routeName);
  }
  setUpRecognizer(APP_ID: string, API_KEY: string, SECRET_KEY: string): void {
    this.controller.setUpRecognizer(APP_ID, API_KEY, SECRET_KEY);
  }
  tryTranslate(text: string, clear = false): void {
    this.controller.tryTranslate(text, clear);
  }

  popup(id: MenuActionType): void {
    this.controller.action.popup(id);
  }

  saveWindow(routeName: RouteActionType, fontSize: number): void {
    this.controller.win.storeWindow(routeName, fontSize);
  }

  restoreWindow(routeName: Identifier | undefined) {
    this.controller.restoreWindow(routeName);
  }
  checkSync() {
    if (this.controller.res) this.controller.sync();
    else {
      this.controller.checkClipboard();
    }
  }
}
