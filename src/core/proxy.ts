import { IProxy } from "./iproxy";
import { Controller } from "./controller";
import { Identifier } from "../tools/identifier";
import { handleActions } from "./actionCallback";
import { Action, RouteName } from "../tools/action";
import { Rectangle } from "electron";

export class Proxy implements IProxy {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  capture() {
    this.controller.capture();
  }

  set(identifier: Identifier, value: any, save: boolean, refresh: boolean) {
    this.controller.set(identifier, value, save, refresh);
  }
  get(identifier: Identifier) {
    return this.controller.get(identifier);
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

  getLocales() {
    return this.controller.locales.getLocales();
  }
  getKeys(routeName: RouteName): Identifier[] {
    return this.controller.action.getKeys(routeName);
  }
  setUpRecognizer(APP_ID: string, API_KEY: string, SECRET_KEY: string): void {
    this.controller.setUpRecognizer(APP_ID, API_KEY, SECRET_KEY);
  }
  tryTranslate(text: string, clear = false): void {
    this.controller.tryTranslate(text, clear);
  }
  routeTo(routerName: string): void {
    this.controller.win.routeTo(routerName);
  }
  popup(id: RouteName): void {
    this.controller.action.popup(id);
  }
  saveWindow(routeName: Identifier, bound: Rectangle, fontSize: number): void {
    this.controller.saveWindow(routeName, bound, fontSize);
  }
  getBound(): Rectangle {
    return this.controller.win.getBound();
  }
  restoreWindow(routeName: Identifier | undefined) {
    this.controller.restoreWindow(routeName);
  }
}
