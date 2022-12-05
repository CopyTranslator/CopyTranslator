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
} from "../common/types";
import { startService } from "../proxy/main";
import { ShortcutManager } from "./shortcut";
import { app, shell } from "electron";
import store, { observers, restoreFromConfig } from "../store";
import { TranslateController } from "./translate-controller";
import { l10n, L10N } from "./l10n";
import actionLinks, { showDragCopyWarning } from "./views/dialog";
import { resetAllConfig } from "./file-related";
import { MainController } from "../common/controller";
import { UpdateChecker } from "./views/update";
import simulate from "./simulate";
import logger from "@/common/logger";
import { keyan } from "@/common/translate/keyan";
import { constants } from "../common/constant";
import { DragCopyMode } from "@/common/types";

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

  simpleDebug() {
    keyan
      .translate(
        "Large-size 2D black phosphorus (BP) nanosheets have been success-fully synthesized by a facile liquid exfoliation method.",
        "en",
        "zh-CN"
      )
      .then((res) => {
        console.log(res);
      });
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

  handle(identifier: Identifier, param: any = null): boolean {
    switch (identifier) {
      case "newConfigSnapshot":
        this.config.newSnapshot(param as string);
        break;
      case "configSnapshot":
        this.config.resumeSnapshot(param as string);
        break;
      case "exit":
        this.handle("closeWindow", null);
        this.onExit();
        break;
      case "settings":
        this.win.get("settings").show();
        break;
      case "enumerateLayouts":
        this.enumerateLayouts(!!param);
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
        this.win.saveBounds(); //修复直接退出时没有保存布局设置的问题
        this.win.closeByName("contrast");
        break;
      case "showWindow":
        this.win.showWindow();
        break;
      case "minimize":
        this.win.mainWindow.minimize();
        break;
      case "simpleDebug":
        this.simpleDebug();
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
        if (
          value == true &&
          this.get<DragCopyMode>("dragCopyMode") === "dragCopyGlobal" &&
          !this.get("neverShow") //只在全局模式才show出来
        ) {
          showDragCopyWarning(this);
        }
        break;
      case "stayTop":
        this.win.setStayTop(value);
        break;
      case "skipTaskbar":
        this.win.mainWindow.setSkipTaskbar(value);
        break;
      case "openAtLogin":
        app.setLoginItemSettings({
          openAtLogin: value,
        });
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
