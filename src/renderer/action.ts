import { BrowserWindow, Menu, MenuItem } from "electron";
import { ConfigParser } from "../common/configParser";
import { Language } from "@opentranslate/languages";
import { hideDirections } from "../common/enums";
import { translatorTypes } from "../common/translate/types";
import { getLanguageLocales } from "../common/translate/locale";
import {
  Identifier,
  MenuActionType,
  Role,
  roles,
  layoutTypes
} from "../common/types";
import { dictionaryTypes } from "../common/dictionary/types";
import { RendererController } from "./controller";
import bus from "../common/event-bus";

type CallBack = (
  key: string,
  menuItem?: MenuItem,
  browserWindow?: BrowserWindow,
  event?: KeyboardEvent
) => void;

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
  callback: CallBack;
  controller: RendererController;

  constructor(callback: CallBack, controller: RendererController) {
    this.callback = callback;
    this.controller = controller;
  }

  init() {
    this.initActions(this.controller.config, this.callback);
    bus.gon("openMenu", (event, args) => {
      console.log(args);
      this.popup(args);
    });
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

  append(action: TopAction) {
    this.actions.set(action.id, action);
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

  initActions(config: ConfigParser, callback: Function) {
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
        return RendererController.getInstance()
          .transCon.getSupportLanguages()
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

    this.append(listAction("hideDirect", hideDirections));
    this.append(listAction("translatorType", translatorTypes));
    this.append(listAction("dictionaryType", dictionaryTypes));
    this.append(listAction("layoutType", layoutTypes));

    this.append(switchAction("autoCopy"));
    this.append(switchAction("autoPaste"));
    this.append(switchAction("autoFormat"));
    this.append(switchAction("autoPurify"));
    this.append(switchAction("incrementalCopy"));
    this.append(switchAction("smartTranslate"));
    this.append(switchAction("autoHide"));
    this.append(switchAction("autoShow"));
    this.append(switchAction("stayTop"));
    this.append(switchAction("smartDict"));
    this.append(switchAction("drawer"));
    this.append(switchAction("listenClipboard"));
    this.append(switchAction("dragCopy"));
    this.append(switchAction("enableNotify"));
    this.append(switchAction("skipTaskbar"));
    this.append(switchAction("closeAsQuit"));
    this.append(switchAction("autoCheckUpdate"));

    this.append(normalAction("copySource"));
    this.append(normalAction("copyResult"));
    this.append(normalAction("clear"));
    this.append(normalAction("retryTranslate"));
    this.append(normalAction("focus"));
    this.append(normalAction("contrast"));
    this.append(normalAction("capture"));
    this.append(normalAction("restoreDefault"));
    this.append(normalAction("font+"));
    this.append(normalAction("font-"));

    this.append(constantAction("APP_ID"));
    this.append(constantAction("API_KEY"));
    this.append(constantAction("SECRET_KEY"));

    //role action
    roles.forEach(role => {
      this.append(roleAction(role));
    });

    this.append(
      selectAction(
        "sourceLanguage",
        createLanguageGenerator("sourceLanguage", true)
      )
    );

    this.append(
      selectAction(
        "targetLanguage",
        createLanguageGenerator("targetLanguage", false)
      )
    );
    this.append(
      selectAction("localeSetting", localeGenerator("localeSetting"))
    );

    this.append(normalAction("settings"));
    this.append(normalAction("helpAndUpdate"));
    this.append(normalAction("exit"));
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
        contain.push("restoreDefault");
        break;
      case "focusContext":
        contain = ["copy", "paste", "cut", "clear", "focus"];
        break;
      case "contrastContext":
        contain = ["copy", "paste", "cut", "clear", "copyResult", "copySource"];
        break;
      case "draggableOptions":
        contain = keys.filter(x => this.getAction(x).actionType !== "constant");
    }
    return contain;
  }

  popup(id: MenuActionType) {
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
}

export { ActionManager, MenuItemType, compose, decompose, roles };
