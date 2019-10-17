import { Accelerator } from "electron";
import { Identifier } from "./types";

interface Shortcut {
  accelerator: Accelerator;
  id: Identifier;
}

export type Shortcuts = Map<Identifier, Accelerator>;

const defaultGlobalShortcuts: Shortcuts = new Map([
  ["focus", "Shift+F1"],
  ["contrast", "Shift+F2"]
]);

const defaultLocalShortcuts: Shortcuts = new Map([
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

export {
  Shortcut,
  defaultGlobalShortcuts as defaultShortcuts,
  defaultLocalShortcuts
};
