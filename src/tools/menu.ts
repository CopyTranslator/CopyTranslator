import { Menu, MenuItem, BrowserWindow } from "electron";
import { RuleName } from "./rule";
import { ConfigParser, getEnumValue as r } from "./configParser";
//r can be used to transform a enum to string

enum RouteName {
  Focus = "Focus",
  Contrast = "Contrast",
  Settings = "Settings"
}

enum MenuItemType {
  normal = "normal",
  separator = "separator",
  submenu = "submenu",
  checkbox = "checkbox",
  radio = "radio"
}

interface MenuOption {
  label: string;
  type: MenuItemType;
  checked?: boolean;
  id: string;
  click?: (
    menuItem: MenuItem,
    browserWindow: BrowserWindow,
    event: Event
  ) => void;
}

function NewMenuItem(option: MenuOption, func: Function) {
  var key = option.id;
  if (!option.click) {
    option.click = function(
      menuItem: MenuItem,
      browserWindow: BrowserWindow,
      event: Event
    ) {
      func(menuItem, browserWindow, event, key);
    };
  }
  return new MenuItem(option);
}

class BaseMenu {
  func: Function;
  t: Function;
  constructor(func: Function, t: Function) {
    this.func = func;
    this.t = t;
  }
  initMenu(menu: Menu, items: Array<MenuOption>) {
    items.forEach(item => {
      item.label = this.t(item.label);
      menu.append(NewMenuItem(item, this.func));
    });
  }
  popup(id: RouteName) {
    let menu = new Menu();
    let config = (<any>global).controller.config;
    this.initMenu(menu, getItems(config, id));
    menu.popup({});
  }
}

function getItems(config: ConfigParser, type: RouteName) {
  let items: Array<MenuOption> = [];
  items.push({
    label: "copySource",
    type: MenuItemType.normal,
    id: "copySource"
  });
  items.push({
    label: "copyResult",
    type: MenuItemType.normal,
    id: "copyResult"
  });
  items.push({
    label: "clear",
    type: MenuItemType.normal,
    id: "clear"
  });
  items.push({
    label: "autoCopy",
    type: MenuItemType.checkbox,
    checked: config.values.isCopy,
    id: r(RuleName.isCopy)
  });

  items.push({
    label: "autoHide",
    type: MenuItemType.checkbox,
    checked: config.values.autoHide,
    id: r(RuleName.autoHide)
  });

  items.push({
    label: "autoShow",
    type: MenuItemType.checkbox,
    checked: config.values.autoShow,
    id: r(RuleName.autoShow)
  });

  items.push({
    label: "stayTop",
    type: MenuItemType.checkbox,
    checked: config.values.stayTop,
    id: r(RuleName.stayTop)
  });

  items.push({
    label: "switchMode",
    type: MenuItemType.normal,
    id: "switchMode"
  });

  items.push({
    label: "settings",
    type: MenuItemType.normal,
    id: "settings"
  });

  items.push({
    label: "exit",
    type: MenuItemType.normal,
    id: "exit"
  });

  return items;
}

export { BaseMenu, MenuItemType, getItems, RouteName };
