import { Mutation } from "./types";
import bus from "../../common/event-bus";

//协同响应,更新视图
export const updateViewPlugin = (store: any) => {
  //只在渲染进程做视图的更新
  if (process.type != "renderer") {
    return;
  }
  store.subscribe((mutation: Mutation, state: any) => {
    if (mutation.type == "setLanguages") {
      bus.at("sourceLanguage");
      bus.at("targetLanguage");
    }
  });
};
