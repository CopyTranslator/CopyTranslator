import { globalShortcut, Accelerator } from "electron";
type Shortcut = {
  description: string;
  accelerator: Accelerator;
  callback: Function;
  key: string;
};
class ShortcutManager {
  shortcuts: Array<Shortcut> = [];
  addSwitch() {}
  addNormal() {}
  register() {
    this.shortcuts.forEach(e => {
      globalShortcut.register(e.accelerator, e.callback);
    });
  }
  unregister() {
    this.shortcuts.forEach(e => {
      globalShortcut.unregister(e.accelerator);
    });
  }
}
