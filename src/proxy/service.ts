import { app as ElectronApp, BrowserWindow, ipcMain, session } from "electron";
import { isPromise } from "./helper";

export function startService<T>(proxy: T, key: string) {
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
