export const authorizeKey: string = "CopyTranslator";
import flatten from "lodash.flatten";
//以下是做一个特定的事的动作
export const normalActionTypes = [
  "doubleCopyTranslate", //双击ctrl c 触发
  "translate", //翻译
  "selectionQuery", //翻译
  "copySource", //复制原文
  "copyResult", //复制译文
  "pasteResult", //粘贴译文
  "clear", //清空
  "helpAndUpdate",
  "exit",
  "viewSource",
  "return",
  "retryTranslate",
  "evaluate",
  "homepage",
  "userManual",
  "checkUpdate",
  "toDownload",
  "changelog",
  "cancel",
  "ok",
  "restoreDefault",
  "capture",
  "font+",
  "font-",
  "drawer",
  "editConfigFile",
  "showConfigFolder",
  "hideWindow",
  "closeWindow",
  "showWindow",
  "translateClipboard",
  "notify",
  "toast",
  "incrementSelect",
  "simulateCopy",
  "simulateIncrementCopy",
] as const;

//切换值的动作
export const constantActionTypes = [
  "source",
  "result",
  "localeName",
  "sourceLanguage",
  "targetLanguage",
  "localeSetting",
  "hideDirect",
  "translatorType",
  "dictionaryType",
  "layoutType",
  "frameMode",
  "autoCheckUpdate",
  "colorMode",
  "version",
] as const;

export const translatorTypes = [
  "baidu",
  "google",
  // "sogou",
  "caiyun",
  "tencent",
  "youdao",
  "baidu-domain",
] as const;

export const recognizerTypes = ["baidu-ocr"] as const;

export type TranslatorType = typeof translatorTypes[number];
export type RecognizerType = typeof recognizerTypes[number];

//结构体的动作
export type StructActionType = TranslatorType | RecognizerType;
export const structActionTypes: readonly StructActionType[] = flatten([
  recognizerTypes,
  translatorTypes,
]);

//切换值的动作
export const switchActionTypes = [
  "skipTaskbar",
  "stayTop",
  "listenClipboard",
  "autoCopy",
  "autoPaste",
  "autoPurify",
  "neverShow",
  "smartDict",
  "autoHide",
  "autoFormat",
  "autoShow",
  "incrementalCopy",
  "enableNotify",
  "smartTranslate",
  "smartDict",
  "dragCopy",
  "doubleClickCopy", //鼠标双击复制
  "closeAsQuit",
  "contrastDict",
  "openAtLogin",
  "toastTip",
  "multiSource",
  "enableDoubleCopyTranslate",
] as const;

//Electron 原生 角色
export const roles = [
  "undo",
  "redo",
  "cut",
  "copy",
  "paste",
  "pasteAndMatchStyle",
  "selectAll",
  "delete",
  "minimize",
  "close",
  "quit",
  "reload",
  "forceReload",
  "toggleDevTools",
  "togglefullscreen",
  "resetZoom",
  "zoomIn",
  "zoomOut",
  "editMenu",
  "windowMenu",
] as const;

//不同位置动作列表
export const menuActionTypes = [
  "contrastPanel", //面板上显示的
  "contrastContext", //上下文
  "focusContext", //上下文
  "focusRight", // 按钮右键
  "switches", //设置的开关面板
  "options", //设置的选项面板
  "apiConfig", //设置的配置面板
  "translatorConfig",
  "tray", //任务栏托盘右键菜单
  "draggableOptions", //
  "allActions",
] as const;

export const translatorGroups = [
  "translator-auto",
  "translator-double",
] as const;

//布局名称
export const layoutTypes = ["horizontal", "vertical", "focus"] as const;

// 百度垂直领域翻译
export const domains = ["medicine", "electronics", "mechanics"];

//路由名称
export const routeActionTypes = [
  "contrast",
  "settings", //设置页面
  "update",
] as const;

//路由名称
export const colorModes = [
  "dark",
  "light", //设置页面
  "auto",
] as const;

export const eventTypes = [
  "firstLoad",
  "closeWindow",
  "openMenu",
  "minify",
  "initialized",
  "callback",
  "dispatch",
  "preSet",
  "allTranslated",
] as const;

export type Role = typeof roles[number];
export type SwitchActionType = typeof switchActionTypes[number];
export type ConstantActionType = typeof constantActionTypes[number];
export type NormalActionType = typeof normalActionTypes[number];
export type TranslatorGroup = typeof translatorGroups[number];
export type MenuActionType = typeof menuActionTypes[number];
export type RouteActionType = typeof routeActionTypes[number];
export type LayoutType = typeof layoutTypes[number];
export type Domain = typeof domains[number];
export type ColorMode = typeof colorModes[number];
export type EventType = typeof eventTypes[number];

export type Identifier =
  | RouteActionType
  | LayoutType
  | NormalActionType
  | MenuActionType
  | SwitchActionType
  | ConstantActionType
  | TranslatorType
  | RecognizerType
  | Role
  | TranslatorGroup;

export const identifiers: readonly Identifier[] = flatten([
  roles,
  switchActionTypes,
  constantActionTypes,
  normalActionTypes,
  menuActionTypes,
  routeActionTypes,
  layoutTypes,
  translatorGroups,
  translatorTypes,
  recognizerTypes,
]);

export type MenuItemType =
  | "normal"
  | "separator"
  | "submenu"
  | "checkbox"
  | "radio";

export type ActionType = "constant" | "config";
interface AbstractAction {
  actionType?: ActionType | MenuItemType;
  id: string;
  submenu?: Array<SubActionView>;
  subMenuGenerator?: () => SubActionView[];
  type?: MenuItemType;
  tooltip?: string;
  role?: Role;
  label?: string;
}

export interface SubActionView extends AbstractAction {
  label: string;
  id: string;
}
export interface ActionView extends AbstractAction {
  id: Identifier;
  actionType: ActionType | MenuItemType;
}

export interface ActionInitOpt extends AbstractAction {
  id: Identifier;
}

export const hideDirections = [
  "Up",
  "Right",
  "Left",
  "None",
  "Minify",
] as const;
export type HideDirection = typeof hideDirections[number];

export const colorStatuses = [
  "None",
  "Listen",
  "AutoCopy",
  "Translating",
  "Incremental",
  "IncrementalCopy",
  "AutoPaste",
  "IncrementalCopyPaste",
  "Fail",
] as const;
export type ColorStatus = typeof colorStatuses[number];

function rgb(r: number, g: number, b: number) {
  const R = Math.floor(r / 16).toString(16) + Math.floor(r % 16).toString(16);
  const G = Math.floor(g / 16).toString(16) + Math.floor(g % 16).toString(16);
  const B = Math.floor(b / 16).toString(16) + Math.floor(b % 16).toString(16);
  return "#" + R + G + B;
}

export const colorStatusMap = new Map<ColorStatus, string>([
  ["None", rgb(190, 190, 190)],
  ["Listen", rgb(84, 255, 159)],
  ["AutoCopy", rgb(152, 245, 255)],
  ["Translating", rgb(238, 238, 0)],
  ["Incremental", rgb(147, 112, 219)],
  ["IncrementalCopy", rgb(199, 21, 133)],
  ["AutoPaste", rgb(0, 0, 139)],
  ["IncrementalCopyPaste", rgb(0, 0, 128)],
  ["Fail", rgb(255, 0, 0)],
]);

export type Locale = { [key: string]: string };

export function compose(actions: Array<string>) {
  return actions.join("|");
}

export function recoverType(
  param: string | undefined
): boolean | string | number | undefined {
  if (!param) {
    return undefined;
  }
  const num = new Number(param);
  if (!Number.isNaN(num.valueOf())) {
    return num.valueOf();
  }
  switch (param) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return param;
  }
}

export function decompose(...args: any[]) {
  const params = args.length == 1 ? args[0].split("|") : args;
  const param = args.length == 1 ? recoverType(params[1]) : params[1];
  const identifier = <Identifier>params[0];
  return {
    identifier,
    param,
  };
}

export function mapToObj<T>(strMap: Map<string, T>): { [key: string]: T } {
  const obj = Object.create({});
  for (const [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

export function objToMap<T>(obj: { [key: string]: T }): Map<Identifier, T> {
  const strMap = new Map();
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
