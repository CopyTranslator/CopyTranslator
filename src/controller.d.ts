import { Controller } from "./core/controller";

declare global {
  namespace NodeJS {
    interface Global {
      controller: Controller;
    }
  }
}
