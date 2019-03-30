import { Accelerator } from "electron";

interface Shortcut {
  accelerator: Accelerator;
  id: string;
}

type Shortcuts = { [key: string]: string };
const defaultShortcuts: Shortcuts = {
  focusMode: "Shift+F1",
  contrastMode: "Shift+F2",
  listenClipboard: "CommandOrControl+L"
};

export { Shortcut, defaultShortcuts, Shortcuts };
