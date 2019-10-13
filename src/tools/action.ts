import {
  Accelerator,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem
} from "electron";

import { ConfigParser } from "./configParser";
import { Language } from "@opentranslate/languages";
import { envConfig } from "./envConfig";
import { HideDirection } from "./enums";
import { translatorTypes } from "./translators";
import { defaultShortcuts, defaultLocalShortcuts } from "./shortcuts";
import { Controller } from "../core/controller";
import { getLanguageLocales } from "./translators/locale";
import { Identifier, identifiers } from "./identifier";

const fs = require("fs");

function compose(actions: Array<string>) {
  return actions.join("|");
}

function decompose(id: string) {
  return id.split("|");
}

type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio";

enum ActionType {
  constant = "constant"
}

type RouteName =
  | "Focus"
  | "Contrast"
  | "Settings"
  | "Tray"
  | "Update"
  | "OCRConfig"
  | "FocusText"
  | "Options"
  | "Switches"
  | "MenuDrag"
  | "AllActions";

interface Action {
  label?: string;
  type?: MenuItemType;
  checked?: boolean;
  actionType?: ActionType | MenuItemType;
  id: string;
  submenu?: Array<Action>;
  role?: string;
  tooltip?: string;
  accelerator?: string;
  subMenuGenerator?: () => Array<Action>;
  click?: (
    menuItem: MenuItem,
    browserWindow: BrowserWindow,
    event: Event
  ) => void;
}

function ActionWrapper(
  action: Action,
  callback: Function | undefined = undefined
) {
  const key = action.id;
  if (action.type) {
    action.actionType = action.type;
  } else {
    action.type = "normal";
  }
  if (!action.click && callback) {
    action.click = function(
      menuItem: MenuItem,
      browserWindow: BrowserWindow,
      event: Event
    ) {
      callback(key, menuItem, browserWindow, event);
    };
  }
  return action;
}

type Actions = Map<Identifier, Action>;

const roles: Identifier[] = [
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "pasteAndMatchStyle",
  "selectAll",
  "delete",
  "minimize",
  "close",
  "quit",
  "reload",
  "forcereload",
  "toggledevtools",
  "toggleFullScreen",
  "resetzoom",
  "zoomin",
  "zoomout",
  "editMenu",
  "windowMenu"
];

class ActionManager {
  actions = new Map<Identifier, Action>();
  shortcuts = new Map<Identifier, Accelerator>();
  localShortcuts = new Map<Identifier, Accelerator>();
  callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
  }

  init() {
    this.actions = this.getActions(
      (<Controller>(<any>global).controller).config,
      this.callback
    );
    this.loadGlobalShortcuts();
    this.register();
    this.loadLocalShortcuts();
    this.registerLocalShortcuts();
  }

  update() {
    const refresh = this.getRefreshFunc();
    for (const key of this.actions.keys()) {
      this.actions.set(key, refresh(key, <Action>this.actions.get(key)));
    }
  }
  getAction(identifier: Identifier): Action {
    return <Action>this.actions.get(identifier);
  }

  getRefreshFunc() {
    const controller = <Controller>(<any>global).controller;
    let config = controller.config;
    const t = controller.getT();
    const l = getLanguageLocales(<Language>controller.get("localeSetting"));

    function refreshSingle(key: Identifier, action: Action): Action {
      action.label = t(<Identifier>key);
      if (action.role) {
        action.click = undefined;
        return action;
      }
      if (action.type == "checkbox") {
        action.checked = config.get(key);
      }

      if (action.subMenuGenerator) {
        action.submenu = action.subMenuGenerator();
      }
      if (action.submenu) {
        const value = config.get(key).toString();
        for (const key2 in action.submenu) {
          const param = decompose(action.submenu[key2].id)[1].toString();
          action.submenu[key2].checked = param == value;
          if (key === "sourceLanguage" || key === "targetLanguage") {
            action.submenu[key2].label = l[<Language>action.submenu[key2].id];
          }
        }
      }
      return action;
    }
    return refreshSingle;
  }

  getActions(config: ConfigParser, callback: Function): Actions {
    let items: Array<Action> = [];
    const l = getLanguageLocales(<Language>config.get("localeSetting"));
    //普通的按钮，执行一项操作
    function normalAction(id: Identifier) {
      return ActionWrapper(
        {
          type: "normal",
          id: id,
          tooltip: id
        },
        callback
      );
    }
    //原生角色
    function roleAction(role: Identifier): Action {
      return {
        role: role,
        id: role,
        type: "normal",
        tooltip: role
      };
    }
    //设置常量
    function constantAction(identifier: Identifier) {
      return ActionWrapper(
        {
          actionType: ActionType.constant,
          id: identifier,
          tooltip: identifier
        },
        callback
      );
    }

    //切换状态的动作
    function switchAction(identifier: Identifier) {
      return ActionWrapper(
        {
          type: "checkbox",
          checked: config.get(identifier),
          id: identifier,
          tooltip: config.getTooltip(identifier)
        },
        callback
      );
    }

    //枚举类型，应该是select的一种特化
    function enumAction(identifier: Identifier, type: any) {
      return ActionWrapper(
        {
          type: "submenu",
          id: identifier,
          tooltip: config.getTooltip(identifier),
          submenu: Object.values(type)
            .filter((k): k is number => typeof k == "number")
            .map(e => {
              return ActionWrapper(
                {
                  type: "checkbox",
                  id: compose([identifier, (<number>e).toString()]),
                  label: type[<number>e]
                },
                callback
              );
            })
        },
        callback
      );
    }
    //列表类型，是select的一种特化
    function listAction(identifier: Identifier, list: any) {
      return ActionWrapper(
        {
          type: "submenu",
          id: identifier,
          tooltip: config.getTooltip(identifier),
          submenu: list.map((e: any) => {
            return ActionWrapper(
              {
                type: "checkbox",
                id: compose([identifier, e.toString()]),
                label: e
              },
              callback
            );
          })
        },
        callback
      );
    }

    //自动生成子菜单
    function selectAction(
      identifier: Identifier,
      subMenuGenerator: () => Array<Action>
    ) {
      return ActionWrapper(
        {
          type: "submenu",
          id: identifier,
          subMenuGenerator: subMenuGenerator,
          tooltip: config.getTooltip(identifier)
        },
        callback
      );
    }

    const languageGenerator = (
      identifier: Identifier,
      allowAuto: boolean = true
    ) => {
      return () => {
        return (<Controller>(<any>global).controller).translator
          .getSupportLanguages()
          .filter(x => {
            if (!allowAuto && x == "auto") {
              return false;
            }
            return true;
          })
          .map((e: string) => {
            return ActionWrapper(
              {
                id: compose([identifier, e]),
                label: l[<Language>e],
                type: "checkbox"
              },
              callback
            );
          });
      };
    };

    const localeGenerator = () => {
      const id = "localeSetting";
      return (<Controller>(<any>global).controller).locales
        .getLocales()
        .map((locale: any) => {
          return ActionWrapper(
            {
              id: compose([id, locale.short]),
              label: locale.localeName,
              type: "checkbox"
            },
            callback
          );
        });
    };

    items.push(enumAction("hideDirect", HideDirection));
    items.push(listAction("translatorType", translatorTypes));

    items.push(normalAction("copySource"));
    items.push(normalAction("copyResult"));
    items.push(normalAction("clear"));
    items.push(normalAction("retryTranslate"));

    items.push(switchAction("autoCopy"));
    items.push(switchAction("autoPaste"));
    items.push(switchAction("autoFormat"));
    items.push(switchAction("autoPurify"));
    items.push(switchAction("detectLanguage"));
    items.push(switchAction("incrementalCopy"));
    items.push(switchAction("smartTranslate"));
    items.push(switchAction("autoHide"));
    items.push(switchAction("autoShow"));
    items.push(switchAction("stayTop"));
    items.push(switchAction("listenClipboard"));
    items.push(switchAction("dragCopy"));
    items.push(switchAction("enableNotify"));
    items.push(switchAction("skipTaskbar"));

    items.push(normalAction("focusMode"));
    items.push(normalAction("contrastMode"));
    items.push(normalAction("capture"));
    items.push(normalAction("restoreDefault"));

    items.push(constantAction("APP_ID"));
    items.push(constantAction("API_KEY"));
    items.push(constantAction("SECRET_KEY"));

    //role action
    roles.forEach((role: Identifier) => {
      items.push(roleAction(role));
    });

    items.push(
      selectAction("sourceLanguage", languageGenerator("sourceLanguage", true))
    );
    items.push(
      selectAction("targetLanguage", languageGenerator("targetLanguage", false))
    );

    items.push(selectAction("localeSetting", localeGenerator));
    items.push(normalAction("settings"));
    items.push(normalAction("helpAndUpdate"));
    items.push(normalAction("exit"));

    //下面将数组变为字典
    let itemGroup: Actions = new Map<Identifier, Action>();
    items.forEach(action => {
      itemGroup.set(<Identifier>action.id, action);
    });
    return itemGroup;
  }

  getKeys(routeName: RouteName): Array<Identifier> {
    let contain: Array<Identifier> = [];
    const controller = <Controller>(<any>global).controller;
    const keys: Array<Identifier> = Array.from(this.actions.keys());
    switch (routeName) {
      case "AllActions":
        contain = keys;
        break;
      case "Focus":
        contain = controller.get("focusMenu");
        break;
      case "Contrast":
        contain = controller.get("contrastMenu");
        break;
      case "Tray":
        contain = controller.get("trayMenu");
        break;
      case "Options":
        contain = keys.filter(x => this.getAction(x).type == "submenu");
        break;
      case "Switches":
        contain = keys.filter(x => {
          this.getAction(x).type == "checkbox";
        });
        break;
      case "FocusText":
        contain = ["copyResult", "copySource", "copy", "paste", "cut", "clear"];
        break;
      case "MenuDrag":
        contain = keys.filter(
          x => this.getAction(x).actionType != ActionType.constant
        );
    }
    return contain;
  }

  popup(id: RouteName) {
    const contain = this.getKeys(id);
    const refresh = this.getRefreshFunc();
    const all_keys = this.getKeys("AllActions");
    let menu = new Menu();
    contain
      .filter(key => all_keys.includes(key))
      .forEach(key => {
        menu.append(new MenuItem(refresh(key, this.getAction(key))));
      });
    try {
      menu.popup({});
    } catch (e) {
      console.log(e);
    }
  }

  loadGlobalShortcuts() {
    this.shortcuts = defaultShortcuts;
    try {
      this.shortcuts = JSON.parse(fs.readFileSync(envConfig.shortcut, "utf-8"));
    } catch (e) {
      fs.writeFileSync(
        envConfig.shortcut,
        JSON.stringify(defaultShortcuts, null, 4)
      );
    }
  }

  loadLocalShortcuts() {
    this.localShortcuts = defaultLocalShortcuts;
    try {
      this.localShortcuts = JSON.parse(
        fs.readFileSync(envConfig.localShortcut, "utf-8")
      );
    } catch (e) {
      fs.writeFileSync(
        envConfig.localShortcut,
        JSON.stringify(defaultLocalShortcuts, null, 4)
      );
    }
  }

  register() {
    Array.from(this.shortcuts.keys()).forEach(key => {
      const action = this.getAction(key);
      if (action) {
        globalShortcut.register(
          <Identifier>this.shortcuts.get(key),
          <Function>action.click
        );
      }
    });
  }

  unregister() {
    Object.values(this.shortcuts).forEach(accelerator => {
      globalShortcut.unregister(accelerator);
    });
  }

  registerLocalShortcuts() {
    let menu = new Menu();
    const refresh = this.getRefreshFunc();
    Array.from(this.localShortcuts.keys()).forEach(key => {
      let action = this.getAction(key);
      if (action) {
        menu.append(
          new MenuItem(
            Object.assign(
              {
                accelerator: this.localShortcuts.get(key)
              },
              refresh(key, action)
            )
          )
        );
      }
    });
    Menu.setApplicationMenu(menu);
  }
}

export { RouteName, ActionManager, MenuItemType, compose, decompose, roles };
