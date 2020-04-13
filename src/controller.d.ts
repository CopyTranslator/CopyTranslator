import { Controller } from "./main/controller";

declare global {
  namespace NodeJS {
    interface Global {
      controller: Controller;
      shortcutCapture: any;
    }
  }
}
