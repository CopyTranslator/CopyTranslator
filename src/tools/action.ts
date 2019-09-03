import {
  Accelerator,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem,
  MenuItemConstructorOptions
} from "electron";
import { RuleName } from "./rule";
import { ConfigParser, getEnumValue as r } from "./configParser";
//r can be used to transform a enum to string
import { envConfig } from "./envConfig";
import { HideDirection } from "./enums";
import { TranslatorType } from "./translation/translators";
import { defaultShortcuts, defaultLocalShortcuts } from "./shortcuts";
import { Controller } from "../core/controller";

const fs = require("fs");
const _ = require("lodash");

function compose(actions: Array<string>) {
  return _.join(actions, "|");
}

function decompose(id: string) {
  return id.split("|");
}

enum MenuItemType {
  normal = "normal",
  separator = "separator",
  submenu = "submenu",
  checkbox = "checkbox",
  radio = "radio"
}

enum ActionType {
  constant = "constant"
}

enum RouteName {
  Focus = "Focus",
  Contrast = "Contrast",
  Settings = "Settings",
  Tray = "Tray",
  Update = "Update",
  OCRConfig = "OCRConfig",
  FocusText = "FocusText", // 专注模式 文本框
  Options = "Options",
  Switches = "Switches",
  MenuDrag = "MenuDrag",
  AllActions = "AllActions"
}

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
    action.type = MenuItemType.normal;
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

type Actions = { [key: string]: Action };
const roles = [
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
  actions: Actions = {};
  shortcuts: { [key: string]: Accelerator } = {};
  localShortcuts: { [key: string]: Accelerator } = {};
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

  getRefreshFunc() {
    const controller = <Controller>(<any>global).controller;
    let config = controller.config;
    const t = controller.getT();
    function refreshSingle(key: string, action: Action): Action {
      action.label = t(key);
      if (action.role) {
        action.click = undefined;
        return action;
      }
      if (action.type == MenuItemType.checkbox) {
        action.checked = config.values[key];
      }

      if (action.subMenuGenerator) {
        action.submenu = action.subMenuGenerator();
      }
      if (action.submenu) {
        const value = config.values[key].toString();
        for (const key2 in action.submenu) {
          const param = decompose(action.submenu[key2].id)[1].toString();
          action.submenu[key2].checked = param == value;
        }
      }
      return action;
    }
    return refreshSingle;
  }

  getActions(config: ConfigParser, callback: Function): Actions {
    let items: Array<Action> = [];
    //普通的按钮，执行一项操作
    function normalAction(id: string) {
      return ActionWrapper(
        {
          type: MenuItemType.normal,
          id: id,
          tooltip: id
        },
        callback
      );
    }
    //原生角色
    function roleAction(role: string) {
      return {
        role: role,
        id: role,
        type: MenuItemType.normal,
        tooltip: role
      };
    }
    //设置常量
    function constantAction(ruleName: RuleName) {
      const id = r(ruleName);
      return ActionWrapper(
        {
          actionType: ActionType.constant,
          id: id,
          tooltip: id
        },
        callback
      );
    }

    //切换状态的动作
    function switchAction(ruleName: RuleName) {
      const id = r(ruleName);
      return ActionWrapper(
        {
          type: MenuItemType.checkbox,
          checked: config.values[id],
          id: id,
          tooltip: config.get_tooltip(ruleName)
        },
        callback
      );
    }

    //枚举类型，应该是select的一种特化
    function enumAction(ruleName: RuleName, type: any) {
      const id = r(ruleName);
      return ActionWrapper(
        {
          type: MenuItemType.submenu,
          id: id,
          tooltip: config.get_tooltip(ruleName),
          submenu: Object.values(type)
            .filter(k => (typeof k as any) == "number")
            .map(e => {
              return ActionWrapper(
                {
                  type: MenuItemType.checkbox,
                  id: compose([id, (<number>e).toString()]),
                  label: type[<number>e]
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
      ruleName: RuleName,
      subMenuGenerator: () => Array<Action>
    ) {
      return ActionWrapper(
        {
          type: MenuItemType.submenu,
          id: r(ruleName),
          subMenuGenerator: subMenuGenerator,
          tooltip: config.get_tooltip(ruleName)
        },
        callback
      );
    }

    const languageGenerator = (ruleName: RuleName) => {
      const id = r(ruleName);
      return () => {
        return (<Controller>(<any>global).controller).translator
          .getLanguages()
          .map((e: string) => {
            return ActionWrapper(
              {
                id: compose([id, e]),
                label: e,
                type: MenuItemType.checkbox
              },
              callback
            );
          });
      };
    };

    const localeGenerator = () => {
      const id = r(RuleName.localeSetting);
      return (<Controller>(<any>global).controller).locales
        .getLocales()
        .map((locale: any) => {
          return ActionWrapper(
            {
              id: compose([id, locale.short]),
              label: locale.localeName,
              type: MenuItemType.checkbox
            },
            callback
          );
        });
    };

    items.push(enumAction(RuleName.hideDirect, HideDirection));
    items.push(enumAction(RuleName.translatorType, TranslatorType));

    items.push(normalAction("copySource"));
    items.push(normalAction("copyResult"));
    items.push(normalAction("clear"));
    items.push(normalAction("retryTranslate"));

    items.push(switchAction(RuleName.autoCopy));
    items.push(switchAction(RuleName.autoPaste));
    items.push(switchAction(RuleName.autoFormat));
    items.push(switchAction(RuleName.autoPurify));
    items.push(switchAction(RuleName.detectLanguage));
    items.push(switchAction(RuleName.incrementalCopy));
    items.push(switchAction(RuleName.smartTranslate));
    items.push(switchAction(RuleName.autoHide));
    items.push(switchAction(RuleName.autoShow));
    items.push(switchAction(RuleName.stayTop));
    items.push(switchAction(RuleName.listenClipboard));
    items.push(switchAction(RuleName.tapCopy));
    items.push(switchAction(RuleName.enableNotify));
    items.push(switchAction(RuleName.skipTaskbar));

    items.push(normalAction("focusMode"));
    items.push(normalAction("contrastMode"));
    items.push(normalAction("capture"));
    items.push(normalAction("restoreDefault"));

    items.push(constantAction(RuleName.APP_ID));
    items.push(constantAction(RuleName.API_KEY));
    items.push(constantAction(RuleName.SECRET_KEY));

    //role action
    roles.forEach((role: string) => {
      items.push(roleAction(role));
    });

    items.push(
      selectAction(
        RuleName.sourceLanguage,
        languageGenerator(RuleName.sourceLanguage)
      )
    );
    items.push(
      selectAction(
        RuleName.targetLanguage,
        languageGenerator(RuleName.targetLanguage)
      )
    );

    items.push(selectAction(RuleName.localeSetting, localeGenerator));
    items.push(normalAction("settings"));
    items.push(normalAction("helpAndUpdate"));
    items.push(normalAction("exit"));

    //下面将数组变为字典
    let itemGroup: Actions = {};
    items.forEach(e => {
      itemGroup[e.id] = e;
    });
    return itemGroup;
  }
  getKeys(id: RouteName) {
    let contain: Array<string> = [];
    const controller = <Controller>(<any>global).controller;
    switch (id) {
      case RouteName.AllActions:
        contain = Object.keys(this.actions);
        break;
      case RouteName.Focus:
        contain = controller.get(RuleName.focusMenu);
        break;
      case RouteName.Contrast:
        contain = controller.get(RuleName.contrastMenu);
        break;
      case RouteName.Tray:
        contain = controller.get(RuleName.trayMenu);
        break;
      case RouteName.Options:
        contain = Object.keys(this.actions).filter(
          x => this.actions[x].type == MenuItemType.submenu
        );
        break;
      case RouteName.Switches:
        contain = Object.keys(this.actions).filter(
          x => this.actions[x].type == MenuItemType.checkbox
        );
        break;
      case RouteName.FocusText:
        contain = ["copyResult", "copySource", "copy", "paste", "cut", "clear"];
        break;
      case RouteName.MenuDrag:
        contain = Object.keys(this.actions).filter(
          x => this.actions[x].actionType != ActionType.constant
        );
    }
    return contain;
  }

  popup(id: RouteName) {
    const contain = this.getKeys(id);
    const refresh = this.getRefreshFunc();
    const all_keys = this.getKeys(RouteName.AllActions);
    let menu = new Menu();
    contain
      .filter(key => _.includes(all_keys, key))
      .forEach(key => {
        menu.append(new MenuItem(refresh(key, this.actions[key])));
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
    Object.keys(this.shortcuts).forEach(key => {
      const action = this.actions[key];
      if (action) {
        globalShortcut.register(this.shortcuts[key], <Function>action.click);
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
    Object.keys(this.localShortcuts).forEach(key => {
      let action = this.actions[key];
      if (action) {
        menu.append(
          new MenuItem(
            Object.assign(
              {
                accelerator: this.localShortcuts[key]
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
