// import {
//   Identifier,
//   MenuActionType,
//   Role,
//   roles,
//   layoutTypes,
//   ActionView,
//   MenuItemType,
//   ActionType,
//   decompose,
//   compose,
//   hideDirections
// } from "../common/types";
// import { BrowserWindow, Menu, MenuItem } from "electron";
// type CallBack = (
//   key: string,
//   menuItem?: MenuItem,
//   browserWindow?: BrowserWindow,
//   event?: KeyboardEvent
// ) => void;

// export interface Action extends ActionView {
//   label?: string;
//   type?: MenuItemType;
//   checked?: boolean;
//   actionType?: ActionType | MenuItemType;
//   id: string;
//   submenu?: Array<Action>;
//   role?: Role;
//   tooltip?: string;
//   accelerator?: string;
//   subMenuGenerator?: () => Array<Action>;
//   click?: (
//     menuItem: MenuItem,
//     browserWindow: BrowserWindow,
//     event: Event
//   ) => void;
// }

// export interface TopAction extends Action {
//   id: Identifier;
// }

// function ActionWrapper(
//     action: ActionView,
//     callback: Function | undefined = undefined
//   ) {
//     if (action.role) {
//       return action;
//     }
//     if (action.type) {
//       action.actionType = action.type;
//     } else {
//       action.type = "normal";
//     }
//     if (!action.click && callback) {
//       action.click = function(
//         menuItem: MenuItem,
//         browserWindow: BrowserWindow,
//         event: Event
//       ) {
//         callback(action.id, menuItem, browserWindow, event);
//       };
//     }
//     return action;
//   }

// function getRefreshFunc() {
//   const controller = global.controller;
//   let config = controller.config;
//   const t = controller.getT();

//   function refreshFunc(key: Identifier, action: ActionView): ActionView {
//     action.label = t(key);
//     if (action.role) {
//       return action;
//     }
//     if (action.actionType == "checkbox") {
//       action.checked = config.get(key);
//     }

//     if (action.subMenuGenerator) {
//       action.submenu = action.subMenuGenerator();
//     }

//     if (action.submenu) {
//       const value = config.get(key).toString();
//       for (const i in action.submenu) {
//         const param = decompose(action.submenu[i].id)[1].toString();
//         action.submenu[i].checked = param == value;
//       }
//     }
//     return action;
//   }
//   return refreshFunc;
// }

// popup(id: MenuActionType) {
//     const contain = this.getKeys(id);
//     const refresh = this.getRefreshFunc();
//     const all_keys = this.getKeys("allActions");
//     let menu = new Menu();
//     contain
//       .filter(key => all_keys.includes(key))
//       .forEach(key => {
//         menu.append(new MenuItem(refresh(key, this.getAction(key))));
//       });
//     try {
//       menu.popup({});
//     } catch (e) {
//       console.log(e);
//     }
//   }
