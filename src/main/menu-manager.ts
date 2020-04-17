import {
  Identifier,
  MenuActionType,
  Role,
  roles,
  layoutTypes,
  ActionView,
  MenuItemType,
  ActionType,
  decompose,
  compose,
  hideDirections,
  SubActionView,
  RouteActionType
} from "../common/types";
import store from "../store";

import { env } from "../common/env";
import { constants } from "../core/constant";
import { BrowserWindow, Menu, MenuItem, Tray } from "electron";
import bus from "../common/event-bus";
import { ActionManager } from "@/common/action";
import { CommonController } from "@/common/controller";
import { ConfigParser } from "@/common/configParser";
type CallBack = (
  menuItem?: MenuItem,
  browserWindow?: BrowserWindow,
  event?: Event
) => void;

export interface MenuAction {
  label?: string;
  type?: MenuItemType;
  checked?: boolean;
  id: string;
  submenu?: Array<MenuAction>;
  role?: Role;
  tooltip?: string;
  accelerator?: string;
  click?: CallBack;
}

export class MenuManager {
  config: ConfigParser;
  act: ActionManager;
  tray: Tray | undefined;

  constructor(controller: CommonController) {
    this.act = controller.action;
    this.config = controller.config;
    bus.gon("openMenu", (name: MenuActionType) => {
      this.openMenu(name);
    });
  }

  getCallback(...args: any[]): CallBack {
    return (
      menuItem?: MenuItem,
      browserWindow?: BrowserWindow,
      event?: Event
    ) => {
      console.log("clicked", args);
      this.act.dispatch(...args);
    };
  }

  actionToMenuItem(action: ActionView): MenuAction {
    if (action.role) {
      return action;
    }
    let menuItem: MenuAction = {
      ...action
    };
    const t = store.getters.locale;
    menuItem.label = t[menuItem.id];
    if (menuItem.type == "checkbox") {
      menuItem.checked = this.config.get(menuItem.id as Identifier);
    }
    if (menuItem.type == "checkbox" || menuItem.type == "normal") {
      menuItem.click = this.getCallback(menuItem.id);
    }
    if (menuItem.submenu) {
      const value = this.config.get(menuItem.id as Identifier);
      for (let subMenuItem of menuItem.submenu) {
        const { identifier, param } = decompose(subMenuItem.id);
        subMenuItem.checked = param == value;
        subMenuItem.click = this.getCallback(subMenuItem.id);
      }
    }

    return menuItem;
  }

  getMenu(name: MenuActionType) {
    const contain = this.act.getKeys(name);
    let menu = new Menu();
    contain.forEach(id => {
      const action = this.act.getAction(id);
      const menuItem = this.actionToMenuItem(action);
      menu.append(new MenuItem(menuItem));
    });
    return menu;
  }

  openMenu(name: MenuActionType) {
    this.getMenu(name).popup({});
  }

  init() {
    this.tray = this.tray ? this.tray : new Tray(env.trayIconPath);
    this.tray.setToolTip(constants.appName);
    this.tray.on("right-click", event => {
      (this.tray as any).popUpContextMenu(this.getMenu("tray"));
    });
    // this.tray.setContextMenu(this.getMenu("tray"));
  }
}
