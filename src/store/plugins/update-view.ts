import { Identifier, Mutation } from "./types";
import { EventBus } from "../../renderer/event-bus";

//协同响应,更新视图
export const connections: Map<Identifier, Identifier[]> = new Map([
  ["translatorType", ["sourceLanguage", "targetLanguage"]]
]);

export const updateViewPlugin = (store: any) => {
  //只在渲染进程做视图的更新
  if (process.type != "renderer") {
    return;
  }
  store.subscribe((mutation: Mutation, state: any) => {
    if (mutation.type != "updateConfig") {
      return;
    }
    for (let key of Object.keys(mutation.payload)) {
      const links = connections.get(key as Identifier);
      if (links) {
        links.forEach(link => EventBus.$emit(link));
      }
    }
  });
};
