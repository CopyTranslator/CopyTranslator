import { Accelerator } from "electron";
import { Identifier } from "./types";
import { env } from "./env";
import { mapToObj, objToMap } from "./types";
import fs from "fs";
import { version, compatible } from "../core/constant";
export interface Shortcut {
  accelerator: Accelerator;
  id: Identifier;
}

export type Shortcuts = Map<Identifier, Accelerator>;

export const defaultGlobalShortcuts: Shortcuts = new Map([
  ["focus", "Shift+F1"],
  ["contrast", "Shift+F2"]
]);

export const defaultLocalShortcuts: Shortcuts = new Map([
  ["undo", "CmdOrCtrl+Z"],
  ["redo", "Shift+CmdOrCtrl+Z"],
  ["cut", "CmdOrCtrl+X"],
  ["copy", "CmdOrCtrl+C"],
  ["paste", "CmdOrCtrl+V"],
  ["selectAll", "CmdOrCtrl+A"],
  ["copyResult", "CmdOrCtrl+S"],
  ["copySource", "CmdOrCtrl+D"],
  ["quit", "Cmd+Q"]
]);

export function resetFile(file: string, config: Map<Identifier, Accelerator>) {
  let res = mapToObj(config);
  res["version"] = version;
  fs.writeFileSync(file, JSON.stringify(res, null, 4));
}
export function resetGlobalShortcuts() {
  resetFile(env.shortcut, defaultGlobalShortcuts);
}

export function resetLocalShortcuts() {
  resetFile(env.localShortcut, defaultLocalShortcuts);
}

export function loadFile(
  file: string,
  defaultConfig: Map<Identifier, Accelerator>
): Map<Identifier, Accelerator> {
  try {
    let config = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!compatible(config.version)) {
      throw "config incompatible";
    } else {
      delete config.version;
      return objToMap(config);
    }
  } catch (e) {
    resetFile(file, defaultConfig);
    return defaultConfig;
  }
}

export function loadGlobalShortcuts(): Map<Identifier, Accelerator> {
  return loadFile(env.shortcut, defaultGlobalShortcuts);
}

export function loadLocalShortcuts(): Map<Identifier, Accelerator> {
  return loadFile(env.localShortcut, defaultLocalShortcuts);
}
