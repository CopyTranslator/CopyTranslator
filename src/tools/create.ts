import { ipcRenderer } from "electron";

type AnyFunction<U extends any[], V> = (...args: U) => V;

type Unpacked<T> = T extends Promise<infer U> ? U : T;

type PromisifiedFunction<T> = T extends AnyFunction<infer U, infer V>
  ? (...args: U) => Promise<Unpacked<V>>
  : never;

export type Promisified<T> = {
  [K in keyof T]: T[K] extends AnyFunction<infer U, infer V>
    ? PromisifiedFunction<T[K]>
    : never;
};

interface IFunctionCollection {
  [k: number]: AnyFunction<any[], any>;
}

let promiseCounter = 0;
const pendingPromiseCallbacks: IFunctionCollection = {};

export function createService<T>(name: string): Promisified<T> {
  const proxy = new Proxy(
    {},
    {
      get(target, key) {
        return (...args: any[]) => {
          return new Promise(resolve => {
            promiseCounter += 1;
            pendingPromiseCallbacks[promiseCounter] = resolve;
            ipcRenderer.send("proxy-service", {
              type: name,
              method: key,
              args,
              promiseCounter
            });

            ipcRenderer.once(
              `proxy-service-res-${promiseCounter}`,
              (event, arg) => {
                pendingPromiseCallbacks[arg.promiseCounter](arg.result);

                delete pendingPromiseCallbacks[arg.promiseCounter];
              }
            );
          });
        };
      }
    }
  );
  return proxy as Promisified<T>;
}
