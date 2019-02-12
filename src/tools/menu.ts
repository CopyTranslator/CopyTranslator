import { Menu, MenuItem, BrowserWindow } from "electron";
import { RuleName } from "./rule";
import { ConfigParser, getEnumValue as r } from "./ConfigParser";
//r can be used to transform a enum to string

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
      func(key);
    };
  }
  return new MenuItem(option);
}

class BaseMenu {
  menu = new Menu();
  initMenu(items: Array<MenuOption>, func: Function, t: Function) {
    items.forEach(item => {
      item.label = t(item.label);
      this.menu.append(NewMenuItem(item, func));
    });
  }
  popup() {
    this.menu.popup({});
  }
}

function getItems(config: ConfigParser) {
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

  return items;
}

export { BaseMenu, MenuItemType, getItems };
