import { Identifier, Mutation, Config } from "./types";

interface Observer {
  postSet(key: Identifier, value: any): boolean; //返回值用来指示是否处理完毕
}

export const observers: Observer[] = [];

export const observePlugin = (store: any) => {
  store.subscribe((mutation: Mutation, state: any) => {
    if (["setConfig", "updateConfig"].indexOf(mutation.type) == -1) {
      return;
    }
    for (const key of Object.keys(mutation.payload)) {
      const val = mutation.payload[key];
      for (const observer of observers) {
        const resolved = observer.postSet(key as Identifier, val);
        if (resolved) {
          break;
        }
      }
    }
  });
};

export function restoreFromConfig(observers: Observer[], config: Config) {
  for (const key of Object.keys(config)) {
    observers.forEach((observer) => {
      observer.postSet(key as Identifier, config[key]);
    });
  }
}
