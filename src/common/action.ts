import { ConfigParser } from "./configParser";
import { translatorTypes } from "./translate/types";
import {
  Identifier,
  MenuActionType,
  Role,
  roles,
  layoutTypes,
  ActionView,
  compose,
  hideDirections,
  SubActionView
} from "./types";
import { dictionaryTypes } from "./dictionary/types";

import store from "../store";

type Actions = Map<Identifier, ActionView>;

function subMenuGenerator(
  identifier: Identifier,
  list: Array<string>
): SubActionView[] {
  return list.map(e => {
    const id = compose([identifier, e.toString()]);
    return {
      id,
      type: "normal",
      label: id
    };
  });
}

class ActionManager {
  actions = new Map<Identifier, ActionView>();
  config: ConfigParser;
  constructor(config: ConfigParser) {
    this.config = config;
  }

  getAction(identifier: Identifier): ActionView {
    const action = this.actions.get(identifier) as ActionView;
    if (action.subMenuGenerator) {
      action.submenu = action.subMenuGenerator();
    }
    return action;
  }

  append(action: ActionView) {
    this.actions.set(action.id, action);
  }

  init() {
    const config = this.config;
    //普通的按钮，执行一项操作
    function normalAction(id: Identifier): ActionView {
      return {
        type: "normal",
        id,
        tooltip: id
      };
    }
    //原生角色
    function roleAction(role: Role): ActionView {
      return {
        role: role,
        id: role,
        type: "normal",
        tooltip: role
      };
    }
    //设置常量
    function constantAction(identifier: Identifier): ActionView {
      return {
        actionType: "constant",
        id: identifier,
        tooltip: identifier
      };
    }

    //切换状态的动作
    function switchAction(identifier: Identifier): ActionView {
      return {
        type: "checkbox",
        id: identifier,
        tooltip: config.getTooltip(identifier)
      };
    }

    //列表类型，是select的一种特化
    function listAction(identifier: Identifier, list: any): ActionView {
      return {
        type: "submenu",
        id: identifier,
        tooltip: config.getTooltip(identifier),
        submenu: subMenuGenerator(identifier, list)
      };
    }

    //自动生成子菜单
    function selectAction(
      identifier: Identifier,
      subMenuGenerator: () => Array<SubActionView>
    ): ActionView {
      return {
        type: "submenu",
        id: identifier,
        subMenuGenerator: subMenuGenerator,
        tooltip: config.getTooltip(identifier)
      };
    }

    function createLanguageGenerator(
      identifier: Identifier,
      allowAuto: boolean = true
    ): () => Array<SubActionView> {
      return () => [];
    }

    const localeGenerator = (id: Identifier) => {
      return () => {
        const locales = store.getters.locales.map((locale: any) => {
          return {
            id: compose([id, locale.lang]),
            label: locale.localeName,
            type: "checkbox"
          };
        });
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
    const keys = Array.from(this.actions.keys());
    switch (optionType) {
      case "allActions":
        contain = keys;
        break;
      case "focusRight":
        contain = this.config.get("focusRight");
        break;
      case "contrastPanel":
        contain = this.config.get("contrastPanel");
        break;
      case "tray":
        contain = this.config.get("tray");
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
}

export { ActionManager };
