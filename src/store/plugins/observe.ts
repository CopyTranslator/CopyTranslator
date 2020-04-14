import { Identifier, Mutation } from "./types";

interface Observer {
  postSet(key: Identifier, value: any): boolean; //返回值用来指示是否处理完毕
}

export let observers: Observer[] = [];

export const observePlugin = (store: any) => {
  store.subscribe((mutation: Mutation, state: any) => {
    if (["setConfig", "updateConfig"].indexOf(mutation.type) == -1) {
      return;
    }
    for (let key of Object.keys(mutation.payload)) {
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
