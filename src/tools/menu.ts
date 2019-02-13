import { Menu, MenuItem, BrowserWindow } from "electron";
import { RuleName } from "./rule";
import { ConfigParser, getEnumValue as r } from "./configParser";
//r can be used to transform a enum to string

enum RouteName {
  Focus = "Focus",
  Contrast = "Contrast",
  Settings = "Settings",
  Tray = "Tray"
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
  constructor(func: Function) {
    this.func = func;
  }
  initMenu(menu: Menu, items: Array<MenuOption>) {
    const t = (<any>global).controller.getT();
    items.forEach(item => {
      item.label = t(item.label);
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
function normalItem(label: string) {
  return {
    label: label,
    type: MenuItemType.normal,
    id: label
  };
}

function getItems(config: ConfigParser, type: RouteName) {
  let items: Array<MenuOption> = [];
  function checkItem(key: RuleName) {
    const label = r(key);
    return {
      label: label,
      type: MenuItemType.checkbox,
      checked: config.values[label],
      id: label
    };
  }
  items.push(normalItem("copySource"));
  items.push(normalItem("copyResult"));
  items.push(normalItem("clear"));
  items.push(checkItem(RuleName.autoCopy));
  items.push(checkItem(RuleName.autoPaste));
  items.push(checkItem(RuleName.detectLanguage));
  items.push(checkItem(RuleName.incrementalCopy));
  items.push(checkItem(RuleName.autoHide));
  items.push(checkItem(RuleName.autoShow));
  items.push(checkItem(RuleName.stayTop));
  if (type != RouteName.Focus) {
    items.push(normalItem("focusMode"));
  }
  if (type != RouteName.Contrast) {
    items.push(normalItem("contrastMode"));
  }
  if (type != RouteName.Settings) {
    items.push(normalItem("settings"));
  }
  items.push(normalItem("exit"));
  return items;
}

export { BaseMenu, MenuItemType, getItems, RouteName };
