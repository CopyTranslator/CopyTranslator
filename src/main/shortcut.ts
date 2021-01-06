import {
  Accelerator,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem,
  KeyboardEvent,
  MenuItemConstructorOptions,
} from "electron";
import { roles, Role } from "../common/types";
import bus from "../common/event-bus";

import {
  Shortcuts,
  loadLocalShortcuts,
  loadGlobalShortcuts,
} from "../common/shortcuts";

type CallBack = (
  key: string,
  menuItem?: MenuItem,
  browserWindow?: BrowserWindow,
  event?: KeyboardEvent
) => void;

function defaultCallback(
  key: string,
  menuItem?: MenuItem,
  browserWindow?: BrowserWindow,
  event?: KeyboardEvent
) {
  bus.at("dispatch", key);
}

class ShortcutManager {
  shortcuts: Shortcuts = new Map<string, Accelerator>();
  localShortcuts = new Map<string, Accelerator>();
  callback: CallBack;

  constructor(callback: CallBack = defaultCallback) {
    this.callback = callback;
  }

  init() {
    this.shortcuts = loadGlobalShortcuts();
    this.register();
    this.localShortcuts = loadLocalShortcuts();
    this.registerLocalShortcuts();
  }

  register() {
    for (const [key, accelerator] of this.shortcuts) {
      const status = globalShortcut.register(accelerator, () => {
        this.callback(key);
      });
      if (!status) {
        console.log("register", accelerator, "fail");
      }
    }
  }

  unregister() {
    Object.values(this.shortcuts).forEach((accelerator) => {
      globalShortcut.unregister(accelerator);
    });
  }

  getMenuItemOptions(key: string, accelerator: Accelerator) {
    const callback = this.callback;
    let options: MenuItemConstructorOptions = {
      accelerator,
      id: key,
      type: "normal",
      click: function (
        menuItem: MenuItem,
        browserWindow: BrowserWindow | undefined,
        event: KeyboardEvent
      ) {
        callback(key, menuItem, browserWindow, event);
      },
    };
    if (roles.indexOf(key as Role) != -1) {
      options = {
        ...options,
        role: key as Role,
        click: undefined,
      };
    }
    return options;
  }

  registerLocalShortcuts() {
    const menu = new Menu();
    for (const [key, accelerator] of this.localShortcuts.entries()) {
      menu.append(new MenuItem(this.getMenuItemOptions(key, accelerator)));
    }
    Menu.setApplicationMenu(menu);
  }
}

export { ShortcutManager };
