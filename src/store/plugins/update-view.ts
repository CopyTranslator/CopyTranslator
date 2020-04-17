import { Mutation } from "./types";
import bus from "../../common/event-bus";
import { Identifier } from "@/common/types";

type Response = {
  check?: (payload: any) => boolean;
  actions: Identifier[];
};

const subMenus: Identifier[] = ["sourceLanguage", "targetLanguage"];

const connections = new Map<string, Response>([
  [
    "updateConfig",
    {
      check: payload => {
        return payload["localeSetting"] != undefined;
      },
      actions: subMenus
    }
  ],
  ["setLanguages", { actions: subMenus }]
]);

//协同响应,更新视图
export const updateViewPlugin = (store: any) => {
  //只在渲染进程做视图的更新
  if (process.type != "renderer") {
    return;
  }
  store.subscribe((mutation: Mutation, state: any) => {
    const response = connections.get(mutation.type);
    if (response != undefined) {
      if (response.check == undefined || response.check(mutation.payload)) {
        response.actions.forEach(e => {
          bus.at(e);
        });
      }
    }
  });
};
