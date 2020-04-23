import { Accelerator } from "electron";
import { env } from "./env";
import { mapToObj, objToMap } from "./types";
import fs from "fs";
import { version, compatible } from "../core/constant";
export interface Shortcut {
  accelerator: Accelerator;
  id: string;
}

export type Shortcuts = Map<string, Accelerator>;

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
  ["quit", "Cmd+Q"],
  ["font+", "CmdOrCtrl+="],
  ["font-", "CmdOrCtrl+-"]
]);

export function resetFile(file: string, config: Map<string, Accelerator>) {
  const res = mapToObj(config);
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
  defaultConfig: Map<string, Accelerator>
): Map<string, Accelerator> {
  try {
    const config = JSON.parse(fs.readFileSync(file, "utf-8"));
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

export function loadGlobalShortcuts(): Map<string, Accelerator> {
  return loadFile(env.shortcut, defaultGlobalShortcuts);
}

export function loadLocalShortcuts(): Map<string, Accelerator> {
  return loadFile(env.localShortcut, defaultLocalShortcuts);
}
