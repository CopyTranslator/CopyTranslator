import { IProxy } from "./iproxy";
import { Controller } from "../main/controller";

export class Proxy implements IProxy {
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }

  capture() {
    global.shortcutCapture.shortcutCapture();
  }
}
