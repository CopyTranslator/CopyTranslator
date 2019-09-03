import { Accelerator } from "electron";

interface Shortcut {
  accelerator: Accelerator;
  id: string;
}

type Shortcuts = { [key: string]: string };

const defaultShortcuts: Shortcuts = {
  focusMode: "Shift+F1",
  contrastMode: "Shift+F2"
};

const defaultLocalShortcuts: Shortcuts = {
  undo: "CmdOrCtrl+Z",
  redo: "Shift+CmdOrCtrl+Z",
  cut: "CmdOrCtrl+X",
  copy: "CmdOrCtrl+C",
  paste: "CmdOrCtrl+V",
  selectAll: "CmdOrCtrl+A",
  copyResult: "CmdOrCtrl+S",
  copySource: "CmdOrCtrl+D",
  quit: "Cmd+Q"
};

export { Shortcut, defaultShortcuts, Shortcuts, defaultLocalShortcuts };
