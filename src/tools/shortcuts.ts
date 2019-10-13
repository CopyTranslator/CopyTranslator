import { Accelerator } from "electron";
import { Identifier } from "./identifier";

interface Shortcut {
  accelerator: Accelerator;
  id: Identifier;
}

type Shortcuts = Map<Identifier, Accelerator>;

const defaultShortcuts: Shortcuts = new Map([
  ["focusMode", "Shift+F1"],
  ["contrastMode", "Shift+F2"]
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

export { Shortcut, defaultShortcuts, Shortcuts, defaultLocalShortcuts };
