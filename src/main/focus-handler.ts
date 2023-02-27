const activeWindow = require("active-win");
import { Identifier } from "@/store";
import config from "../common/configuration";
type BlackWhiteType = "listenClipboard" | "dragCopy";

//检查该窗口是否在白名单内
function checkList(windowName: string, identifier: BlackWhiteType): boolean {
  const mode = config.get(`${identifier}Mode` as Identifier) as string;
  if (mode.indexOf("Global") != -1) {
    return true;
  }
  if (mode.indexOf("WhiteList") != -1) {
    const whitelist = config.get(
      `${identifier}WhiteList` as Identifier
    ) as string[];
    return whitelist.includes(windowName);
  }
  if (mode.indexOf("BlackList") != -1) {
    const blacklist = config.get(
      `${identifier}BlackList` as Identifier
    ) as string[];
    return !blacklist.includes(windowName);
  }
  throw "Unknown Mode";
}

//注册该窗口，同时检查是否是在白名单内
export async function isValidWindow(
  identifier: BlackWhiteType
): Promise<boolean> {
  return activeWindow().then((res: any) => {
    if (!res) {
      return false;
    }
    const windowName = res.owner.name.toString();
    console.log(identifier, windowName);
    const windows = new Set(config.get<string[]>("activeWindows"));
    if (!windows.has(windowName)) {
      windows.add(windowName);
      config.set("activeWindows", [...windows]);
    }
    return checkList(windowName, identifier);
  });
}
