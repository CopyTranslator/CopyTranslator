import { WindowManager } from "./views/manager";
import { eventListener } from "./event-listener";
import { MenuManager } from "./menu-manager";
import {
  Identifier,
  authorizeKey,
  RouteActionType,
  MenuActionType,
  Category,
  layoutTypes,
  LayoutType,
  isValidSnapshotName,
} from "../common/types";
import { startService } from "../proxy/main";
import { ShortcutManager } from "./shortcut";
import { app, shell } from "electron";
import store, { observers, restoreFromConfig } from "../store";
import { TranslateController } from "./translate-controller";
import { l10n, L10N } from "./l10n";
import actionLinks, {
  showDragCopyWarning,
  showDragCopyEmptyWhitelistWarning,
} from "./views/dialog";
import { resetAllConfig } from "./file-related";
import { MainController } from "../common/controller";
import { UpdateChecker } from "./views/update";
import simulate from "./simulate";
import logger from "@/common/logger";
import { constants } from "../common/constant";
import { DragCopyMode } from "@/common/types";
import { icon } from "@/common/env";
import { electronPrompt } from "./prompt";
import bus from "@/common/event-bus";

class Controller extends MainController {
  win: WindowManager = new WindowManager(this);
  menu: MenuManager = new MenuManager(this);
  updater = new UpdateChecker(this);
  shortcut: ShortcutManager = new ShortcutManager();
  l10n: L10N = l10n;
  transCon = new TranslateController(this);

  constructor() {
    super();
    this.config.load();
    observers.push(this);
    observers.push(this.transCon);
    this.bindLinks(actionLinks);
  }

  set(identifier: Identifier, value: any): boolean {
    return this.config.set(identifier, value);
  }

  restoreMultiDefault(optionType: MenuActionType | Category) {
    const keys = this.action.getKeys(optionType);
    for (const key of keys) {
      this.config.reset(key as Identifier); //带参时仅重置特定项
    }
  }

  enumerateLayouts(isLeft: boolean) {
    const index = layoutTypes.findIndex(
      (x) => x === this.config.get<LayoutType>("layoutType")
    );
    let newIndex: number;
    if (isLeft) {
      newIndex = (index + 1) % layoutTypes.length;
    } else {
      newIndex = (index + layoutTypes.length - 1) % layoutTypes.length;
    }
    this.set("layoutType", layoutTypes[newIndex]);
  }

  promptForName() {
    const l = store.getters.locale;
    electronPrompt(
      {
        title: l["snapshotPrompt"],
        label: l["snapshotValidate"],
        value: "",
        inputAttrs: {
          type: "text",
        },
        type: "input",
        icon: icon,
      },
      this.win.mainWindow
    )
      .then((r: any) => {
        if (r === null) {
          console.log("user cancelled");
        } else {
          if (isValidSnapshotName(r as string)) {
            this.handle("newConfigSnapshot", r);
          } else {
            this.promptForName();
          }
        }
      })
      .catch(console.error);
  }

  handle(identifier: Identifier, param: any = null): boolean {
    switch (identifier) {
      case "newConfigSnapshot":
        if (param == null) {
          this.promptForName();
        } else {
          this.config.newSnapshot(param as string);
        }
        break;
      case "delConfigSnapshot":
        this.config.delSnapshot(param as string);
        break;
      case "configSnapshot":
        this.config.resumeSnapshot(param as string);
        break;
      case "exit":
        this.handle("closeWindow", null);
        this.onExit();
        break;
      case "settings":
        this.win.showSettings(param);
        break;
      case "enumerateLayouts":
        this.enumerateLayouts(true);
        break;
      case "restoreMultiDefault":
        this.restoreMultiDefault(param);
        break;
      case "restoreDefault":
        if (param == null) {
          this.resotreDefaultSetting();
        } else {
          this.config.reset(param as Identifier); //带参时仅重置特定项
        }
        break;
      case "checkUpdate":
        this.updater.check();
        break;
      case "homepage":
        shell.openExternal(constants.homepage);
        break;
      case "changelog":
        shell.openExternal(constants.changelogs);
        break;
      case "userManual":
        shell.openExternal(constants.wiki);
        break;
      case "hideWindow":
        this.win.mainWindow.hide();
        break;
      case "close":
        this.win.closeByName(param as RouteActionType);
        break;
      case "closeWindow":
        this.win.closeByName("contrast");
        break;
      case "showWindow":
        this.win.showWindow();
        break;
      case "minimize":
        this.win.mainWindow.minimize();
        break;
      case "simpleDebug":
        break;
      case "simulateCopy":
        setTimeout(() => {
          logger.toast("模拟复制");
          simulate.copy();
        }, 100);
        break;
      default:
        return this.transCon.handle(identifier, param);
    }
    return true;
  }

  async createWindow() {
    this.l10n.install(store, this.config.get("localeSetting")); //修复无法检测系统语言的问题
    await this.transCon.init(); //初始化翻译控制器
    this.restoreFromConfig(); //恢复设置
    eventListener.bind(); //绑定事件
    startService(this, authorizeKey); // 创建代理服务
    this.win.mainWindow; //创建主窗口
    this.shortcut.init();
    this.menu.init();
    if (this.get("autoCheckUpdate")) {
      bus.at("dispatch", "checkUpdate");
    }
  }

  async onExit() {
    await this.transCon.onExit();
    this.config.save();
    this.shortcut.unregister();
    app.exit(); //这里必须是exit，不然就会死锁
  }

  postSet(identifier: Identifier, value: any): boolean {
    switch (identifier) {
      case "layoutType":
        this.win.syncBounds();
        break;
      case "ignoreMouseEvents":
        this.win.setIgnoreMouseEvents(value as boolean);
        break;
      case "localeSetting":
        this.l10n.updateLocale(this.get("localeSetting"));
        break;
      case "dragCopy":
        if (value == true) {
          if (
            this.get<DragCopyMode>("dragCopyMode") === "dragCopyGlobal" &&
            !this.get("neverShow")
          ) {
            //只在全局模式才show出来
            this.win.registerPostStart(() => showDragCopyWarning(this));
          }
          if (
            this.get<DragCopyMode>("dragCopyMode") === "dragCopyWhiteList" &&
            this.get<string[]>("dragCopyWhiteList").length == 0 //白名单模式且白名单为空则警告
          ) {
            this.win.registerPostStart(() =>
              showDragCopyEmptyWhitelistWarning(this)
            );
          }
        }
        break;
      case "stayTop":
        this.win.registerPostStart(() => this.win.setStayTop(value));
        break;
      case "skipTaskbar":
        this.win.registerPostStart(() =>
          this.win.mainWindow.setSkipTaskbar(value)
        );
        break;
      case "openAtLogin":
        app.setLoginItemSettings({
          openAtLogin: value,
        });
        break;
      case "isNewUser":
        if (value) {
          this.updater.showCurrentChangelog();
        }
        break;
      default:
        return false;
    }
    return true;
  }

  resotreDefaultSetting() {
    resetAllConfig();
    this.config.restoreDefault();
    this.restoreFromConfig();
  }

  restoreFromConfig() {
    restoreFromConfig(observers, store.state.config);
  }
}

export { Controller };
