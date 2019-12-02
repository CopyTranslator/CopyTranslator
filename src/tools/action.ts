import {
  Accelerator,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem
} from "electron";

import { ConfigParser } from "./configParser";
import { Language } from "@opentranslate/languages";
import { env } from "./env";
import { hideDirections } from "./enums";
import { translatorTypes } from "./translate/types";
import {
  defaultGlobalShortcuts,
  defaultLocalShortcuts,
  Shortcuts
} from "./shortcuts";
import { Controller } from "../core/controller";
import { getLanguageLocales } from "./translate/locale";
import { Identifier, objToMap, MenuActionType, Role, roles } from "./types";
import { dictionaryTypes } from "../tools/dictionary/types";

const fs = require("fs");

function compose(actions: Array<string>) {
  return actions.join("|");
}

function decompose(id: string) {
  return id.split("|");
}

type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio";

type ActionType = "constant";

export interface Action {
  label?: string;
  type?: MenuItemType;
  checked?: boolean;
  actionType?: ActionType | MenuItemType;
  id: string;
  submenu?: Array<Action>;
  role?: Role;
  tooltip?: string;
  accelerator?: string;
  subMenuGenerator?: () => Array<Action>;
  click?: (
    menuItem: MenuItem,
    browserWindow: BrowserWindow,
    event: Event
  ) => void;
}

export interface TopAction extends Action {
  id: Identifier;
}

function ActionWrapper(
  action: Action,
  callback: Function | undefined = undefined
) {
  if (action.role) {
    return action;
  }
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
      callback(action.id, menuItem, browserWindow, event);
    };
  }
  return action;
}

type Actions = Map<Identifier, TopAction>;

class ActionManager {
  actions = new Map<Identifier, TopAction>();
  shortcuts: Shortcuts = new Map<Identifier, Accelerator>();
  localShortcuts = new Map<Identifier, Accelerator>();
  callback: Function;
  controller: Controller;

  constructor(callback: Function, controller: Controller) {
    this.callback = callback;
    this.controller = controller;
  }

  init() {
    this.actions = this.getActions(this.controller.config, this.callback);
    this.loadGlobalShortcuts();
    this.register();
    this.loadLocalShortcuts();
    this.registerLocalShortcuts();
  }

  update() {
    const refresh = this.getRefreshFunc();
    for (const key of this.actions.keys()) {
      this.actions.set(key, refresh(key, this.actions.get(key) as TopAction));
    }
  }

  getAction(identifier: Identifier): TopAction {
    const action = <TopAction>this.actions.get(identifier);
    if (action.subMenuGenerator) {
      action.submenu = action.subMenuGenerator();
    }
    return action;
  }

  getRefreshFunc() {
    const controller = this.controller;
    let config = controller.config;
    const t = controller.getT();

    function refreshFunc(key: Identifier, action: TopAction): TopAction {
      action.label = t(key);
      if (action.role) {
        return action;
      }
      if (action.actionType == "checkbox") {
        action.checked = config.get(key);
      }

      if (action.subMenuGenerator) {
        action.submenu = action.subMenuGenerator();
      }

      if (action.submenu) {
        const value = config.get(key).toString();
        for (const i in action.submenu) {
          const param = decompose(action.submenu[i].id)[1].toString();
          action.submenu[i].checked = param == value;
        }
      }
      return action;
    }
    return refreshFunc;
  }

  getActions(config: ConfigParser, callback: Function): Actions {
    let items: Array<TopAction> = [];

    //普通的按钮，执行一项操作
    function normalAction(id: Identifier) {
      return ActionWrapper(
        {
          type: "normal",
          id: id,
          tooltip: id
        },
        callback
      ) as TopAction;
    }
    //原生角色
    function roleAction(role: Role) {
      return {
        role: role,
        id: role,
        type: "normal",
        tooltip: role
      } as TopAction;
    }
    //设置常量
    function constantAction(identifier: Identifier) {
      return ActionWrapper(
        {
          actionType: "constant",
          id: identifier,
          tooltip: identifier
        },
        callback
      ) as TopAction;
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
      ) as TopAction;
    }

    //列表类型，是select的一种特化
    function listAction(identifier: Identifier, list: any): TopAction {
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
      ) as TopAction;
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
      ) as TopAction;
    }

    const createLanguageGenerator = (
      identifier: Identifier,
      allowAuto: boolean = true
    ) => {
      return () => {
        const l = getLanguageLocales(<Language>config.get("localeSetting"));
        return this.controller.translator
          .getSupportLanguages()
          .filter(x => {
            if (!allowAuto && x == "auto") {
              return false;
            }
            return true;
          })
          .map(e => {
            return ActionWrapper(
              {
                id: compose([identifier, e]),
                label: l[e],
                type: "checkbox"
              },
              callback
            );
          });
      };
    };

    const localeGenerator = (id: Identifier) => {
      const locales = this.controller.l10n.locales.map(locale => {
        return ActionWrapper(
          {
            id: compose([id, locale.lang]),
            label: locale.localeName,
            type: "checkbox"
          },
          callback
        );
      });
      return () => {
        return locales;
      };
    };

    items.push(listAction("hideDirect", hideDirections));
    items.push(listAction("translatorType", translatorTypes));
    items.push(listAction("dictionaryType", dictionaryTypes));

    items.push(normalAction("copySource"));
    items.push(normalAction("copyResult"));
    items.push(normalAction("clear"));
    items.push(normalAction("retryTranslate"));

    items.push(switchAction("autoCopy"));
    items.push(switchAction("autoPaste"));
    items.push(switchAction("autoFormat"));
    items.push(switchAction("autoPurify"));
    items.push(switchAction("incrementalCopy"));
    items.push(switchAction("smartTranslate"));
    items.push(switchAction("autoHide"));
    items.push(switchAction("autoShow"));
    items.push(switchAction("stayTop"));
    items.push(switchAction("listenClipboard"));
    items.push(switchAction("dragCopy"));
    items.push(switchAction("enableNotify"));
    items.push(switchAction("skipTaskbar"));
    items.push(switchAction("closeAsQuit"));

    items.push(normalAction("focus"));
    items.push(normalAction("contrast"));
    items.push(normalAction("capture"));
    items.push(normalAction("restoreDefault"));

    items.push(constantAction("APP_ID"));
    items.push(constantAction("API_KEY"));
    items.push(constantAction("SECRET_KEY"));

    //role action
    roles.forEach(role => {
      items.push(roleAction(role));
    });

    items.push(
      selectAction(
        "sourceLanguage",
        createLanguageGenerator("sourceLanguage", true)
      )
    );
    items.push(
      selectAction(
        "targetLanguage",
        createLanguageGenerator("targetLanguage", false)
      )
    );
    items.push(selectAction("localeSetting", localeGenerator("localeSetting")));

    items.push(normalAction("settings"));
    items.push(normalAction("helpAndUpdate"));
    items.push(normalAction("exit"));

    //下面将数组变为字典
    let itemGroup: Actions = new Map<Identifier, TopAction>();
    items.forEach(action => {
      itemGroup.set(action.id, action);
    });
    return itemGroup;
  }

  getKeys(optionType: MenuActionType): Array<Identifier> {
    let contain: Array<Identifier> = [];
    const controller = this.controller;
    const keys: Array<Identifier> = Array.from(this.actions.keys());
    switch (optionType) {
      case "allActions":
        contain = keys;
        break;
      case "focusRight":
        contain = controller.get("focusRight");
        break;
      case "contrastPanel":
        contain = controller.get("contrastPanel");
        break;
      case "tray":
        contain = controller.get("tray");
        break;
      case "options":
        contain = keys.filter(x => this.getAction(x).actionType === "submenu");
        break;
      case "switches":
        contain = keys.filter(x => this.getAction(x).actionType === "checkbox");
        break;
      case "focusContext":
        contain = ["copy", "paste", "cut", "clear"];
        break;
      case "contrastContext":
        contain = ["copyResult", "copySource", "copy", "paste", "cut", "clear"];
        break;
      case "draggableOptions":
        contain = keys.filter(x => this.getAction(x).actionType !== "constant");
    }
    return contain;
  }

  popup(id: MenuActionType) {
    global.controller.win.show(true);
    const contain = this.getKeys(id);
    const refresh = this.getRefreshFunc();
    const all_keys = this.getKeys("allActions");
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
    this.shortcuts = defaultGlobalShortcuts;
    try {
      this.shortcuts = objToMap(
        JSON.parse(fs.readFileSync(env.shortcut, "utf-8"))
      );
    } catch (e) {
      fs.writeFileSync(
        env.shortcut,
        JSON.stringify(defaultGlobalShortcuts, null, 4)
      );
    }
  }

  loadLocalShortcuts() {
    this.localShortcuts = defaultLocalShortcuts;
    try {
      this.localShortcuts = objToMap(
        JSON.parse(fs.readFileSync(env.localShortcut, "utf-8"))
      );
    } catch (e) {
      fs.writeFileSync(
        env.localShortcut,
        JSON.stringify(defaultLocalShortcuts, null, 4)
      );
    }
  }

  register() {
    for (const [key, accelerator] of this.shortcuts) {
      const action = this.getAction(key);
      if (action) {
        globalShortcut.register(accelerator, <Function>action.click);
      }
    }
  }

  unregister() {
    Object.values(this.shortcuts).forEach(accelerator => {
      globalShortcut.unregister(accelerator);
    });
  }

  registerLocalShortcuts() {
    let menu = new Menu();
    const refresh = this.getRefreshFunc();
    for (const [key, accelerator] of this.localShortcuts.entries()) {
      let action = this.getAction(key);
      if (action) {
        menu.append(
          new MenuItem({
            accelerator,
            ...refresh(key, action)
          })
        );
      }
    }
    Menu.setApplicationMenu(menu);
  }
}

export { ActionManager, MenuItemType, compose, decompose, roles };
