import { app as ElectronApp, BrowserWindow, ipcMain, session } from "electron";
import { Proxy } from "../core/proxy";
import { Controller } from "./controller";

function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}

export function startService(controller: Controller, key: string) {
  const proxy = new Proxy(controller);
  ipcMain.on("proxy-service", (event: any, arg: any) => {
    if (arg.type === key) {
      const res = (proxy as any)[arg.method](...arg.args);
      if (isPromise(res)) {
        res.then((result: any) => {
          event.sender.send(`proxy-service-res-${arg.promiseCounter}`, {
            succeed: true,
            result,
            promiseCounter: arg.promiseCounter
          });
        });
      } else {
        event.sender.send(`proxy-service-res-${arg.promiseCounter}`, {
          succeed: true,
          result: res,
          promiseCounter: arg.promiseCounter
        });
      }
    }
  });
}
