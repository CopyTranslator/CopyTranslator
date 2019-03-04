import {
  Accelerator,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem
} from "electron";
import { RuleName } from "./rule";
import { ConfigParser, getEnumValue as r } from "./configParser";
//r can be used to transform a enum to string
import { envConfig } from "./envConfig";
import { HideDirection, TranslatorType } from "./enums";

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

enum RouteName {
  Focus = "Focus",
  Contrast = "Contrast",
  Settings = "Settings",
  Tray = "Tray"
}

interface Action {
  label?: string;
  type: MenuItemType;
  checked?: boolean;
  id: string;
  submenu?: Array<Action>;
  subMenuGenerator?: () => Array<Action>;
  click?: (
    menuItem: MenuItem,
    browserWindow: BrowserWindow,
    event: Event
  ) => void;
}

function ActionWrapper(action: Action, callback: Function) {
  const key = action.id;
  if (!action.click) {
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

class ActionManager {
  actions: Actions = {};
  shortcuts: { [key: string]: Accelerator } = {};
  callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
  }

  init() {
    this.actions = this.getActions(
      (<any>global).controller.config,
      this.callback
    );
    this.loadShortcuts();
    this.register();
  }
  getRefresh() {
    const controller = (<any>global).controller;
    let config = controller.config;
    const t = controller.getT();
    function refreshSingle(key: string, action: Action): Action {
      action.label = t(key);
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
  refreshActions(actions: Actions | undefined = undefined) {
    if (!actions) actions = this.actions;
    const refresh = this.getRefresh();
    for (let key in actions) {
      let action = actions[key];
      refresh(key, action);
    }
  }

  getActions(config: ConfigParser, callback: Function): Actions {
    let items: Array<Action> = [];

    function normalAction(id: string) {
      return ActionWrapper(
        {
          type: MenuItemType.normal,
          id: id
        },
        callback
      );
    }

    function switchAction(ruleName: RuleName) {
      const id = r(ruleName);
      return ActionWrapper(
        {
          type: MenuItemType.checkbox,
          checked: config.values[id],
          id: id
        },
        callback
      );
    }

    function enumAction(ruleName: RuleName, type: any) {
      const id = r(ruleName);
      return ActionWrapper(
        {
          type: MenuItemType.submenu,
          id: id,
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
    function selectAction(
      ruleName: RuleName,
      subMenuGenerator: () => Array<Action>
    ) {
      return ActionWrapper(
        {
          type: MenuItemType.submenu,
          id: r(ruleName),
          subMenuGenerator: subMenuGenerator
        },
        callback
      );
    }

    items.push(enumAction(RuleName.hideDirect, HideDirection));
    items.push(enumAction(RuleName.translatorType, TranslatorType));
    items.push(normalAction("copySource"));
    items.push(normalAction("copyResult"));
    items.push(normalAction("clear"));
    items.push(normalAction("retryTranslate"));
    items.push(switchAction(RuleName.autoCopy));
    items.push(switchAction(RuleName.autoPaste));
    items.push(switchAction(RuleName.autoPurify));
    items.push(switchAction(RuleName.detectLanguage));
    items.push(switchAction(RuleName.incrementalCopy));
    items.push(switchAction(RuleName.autoHide));
    items.push(switchAction(RuleName.autoShow));
    items.push(switchAction(RuleName.stayTop));
    items.push(switchAction(RuleName.listenClipboard));
    items.push(switchAction(RuleName.tapCopy));
    items.push(normalAction("focusMode"));
    items.push(normalAction("contrastMode"));

    const languageGenerator = (ruleName: RuleName) => {
      const id = r(ruleName);
      return () => {
        return (<any>global).controller.translator
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

    const localeGenerator = () => {
      const id = r(RuleName.localeSetting);
      return (<any>global).controller.locales
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
    items.push(selectAction(RuleName.localeSetting, localeGenerator));

    items.push(normalAction("settings"));
    items.push(normalAction("helpAndUpdate"));
    items.push(normalAction("exit"));
    let itemGroup: Actions = {};
    items.forEach(e => {
      itemGroup[e.id] = e;
    });
    return itemGroup;
  }
  popup(id: RouteName) {
    let menu = new Menu();
    let contain: Array<string> = [];
    const controller = (<any>global).controller;
    switch (id) {
      case RouteName.Focus:
        contain = controller.get(RuleName.focusMenu);
        break;
      case RouteName.Contrast:
        contain = controller.get(RuleName.contrastMenu);
        break;
      case RouteName.Tray:
        contain = controller.get(RuleName.trayMenu);
        break;
      case RouteName.Settings:
        contain = Object.keys(this.actions);
        break;
    }
    const refresh = this.getRefresh();
    contain.forEach(key => {
      menu.append(new MenuItem(refresh(key, this.actions[key])));
    });
    try {
      menu.popup({});
    } catch (e) {
      console.log(e);
    }
  }

  loadShortcuts() {
    try {
      this.shortcuts = JSON.parse(
        fs.readFileSync(envConfig.sharedConfig.shortcut, "utf-8")
      );
    } catch (e) {
      fs.copyFileSync(
        envConfig.diffConfig.shortcutTemplate,
        envConfig.sharedConfig.shortcut
      );
      this.shortcuts = JSON.parse(
        fs.readFileSync(envConfig.sharedConfig.shortcut, "utf-8")
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
}

export { RouteName, ActionManager, MenuItemType, compose, decompose };
