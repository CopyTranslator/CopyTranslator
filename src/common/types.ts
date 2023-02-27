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
  "restoreMultiDefault",
  "enumerateLayouts",
  "capture",
  "drawer",
  "editConfigFile",
  "showConfigFolder",
  "hideWindow",
  "closeWindow",
  "showWindow",
  "translateClipboard",
  "notify",
  "toast",
  "incrementCounter",
  "simulateCopy",
  "simulateIncrementCopy",
  "translateInput",
  "simpleDebug",
  "welcome",
  "openReference",
  "configSnapshot", //恢复snapshot
  "newConfigSnapshot", //创建新snapshot
  "delConfigSnapshot", //删除快照
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
  "fallbackTranslator",
  "dictionaryType",
  "layoutType",
  "frameMode",
  "autoCheckUpdate",
  "colorMode",
  "version",
  "pasteDelay",
  "googleMirror",
  "googleSource",
  "dragCopyMode",
  "listenClipboardMode",
  "activeWindows",
  "primaryColor",
  "fontColor",
  "backgroundColor",
  "interfaceFontFamily",
  "contentFontFamily",
  "titlebarHeight",
  "configSnapshots",
  "transparency",
  "actionButtons",
] as const;

export const interceptTranslatorTypes = ["bing", "deepl", "tencent"] as const;

export const normalTranslatorTypes = [
  "baidu",
  "google",
  "caiyun",
  "keyan",
  "baidu-domain",
  "youdao",
  "sogou",
] as const;
export const abstractTranslatorTypes = ["copytranslator"] as const;

export type InterceptTranslatorType = typeof interceptTranslatorTypes[number];
export type NormalTranslatorType = typeof normalTranslatorTypes[number];
export type AbstractTranslatorType = typeof abstractTranslatorTypes[number];
export type TranslatorType = InterceptTranslatorType | NormalTranslatorType;
export type GeneralTranslatorType =
  | InterceptTranslatorType
  | NormalTranslatorType
  | AbstractTranslatorType;

export const translatorTypes = flatten([
  interceptTranslatorTypes,
  normalTranslatorTypes,
]);

export const recognizerTypes = ["baidu-ocr", "pp-ocr"] as const;
export const categories = [
  "basic",
  "advance",
  "translation",
  "appearance",
  "snapshotManage",
  "other",
] as const;

export type RecognizerType = typeof recognizerTypes[number];
export type Category = typeof categories[number];

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
  "isNewUser",
  "showGoogleMessage",
  "ignoreMouseEvents",
  "penerate",
  "focusSource",
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
  "diffContext",
  "switches", //设置的开关面板
  "options", //设置的选项面板
  "apiConfig", //设置的配置面板
  "dragCopyConfig", //拖拽复制的配置面板
  "translatorConfig",
  "tray", //任务栏托盘右键菜单
  "allActions",
  "translatorGroups",
  "snapshotManage",
] as const;

export const translatorGroups = [
  "translator-cache",
  "translator-compare",
  "translator-enabled",
  "translator-double",
] as const;

//布局名称
export const layoutTypes = ["horizontal", "vertical", "focus"] as const;

// 百度垂直领域翻译
export const domains = ["medicine", "electronics", "mechanics"] as const;
export const googleSources = ["google", "simply", "lingva"] as const;
export const dragCopyModes = [
  "dragCopyGlobal",
  "dragCopyWhiteList",
  "dragCopyBlackList",
] as const;

export const listenClipboardModes = [
  "listenClipboardGlobal",
  "listenClipboardWhiteList",
  "listenClipboardBlackList",
] as const;

//路由名称
export const routeActionTypes = [
  "contrast",
  "settings", //设置页面
] as const;

//路由名称
export const colorModes = [
  "dark",
  "light", //设置页面
  "auto",
] as const;

export const eventTypes = [
  "closeWindow",
  "openMenu",
  "minify",
  "initialized",
  "callback",
  "dispatch",
  "preSet",
  "setSettingTab",
] as const;

export const displayTexts = [
  "dragCopyPrompt",
  "dragCopyWarning",
  "dragCopyTip",
  "listenClipboardPrompt",
  "listenClipboardConfig",
  "listenClipboardTip",
  "fallbackPrompt1",
  "fallbackPrompt2",
  "about",
  "textAdjustPrompt",
  "googlePrompt",
  "copyButton",
  "closeButton",
  "engineButton",
  "layoutButton",
  "multiSourceButton",
  "addNewActionButton",
  "chooseIconPrompt",
  "left_click",
  "right_click",
  "snapshotPrompt",
  "snapshotValidate",
  "gotoSetting",
  "<tip>snapshot",
  "<tip>focusSource",
  "<tip>splitRatio",
  "<tip>engineRight",
  "<tip>multiSourceEngines",
  "<tip>font",
  "<tip>themeColor",
  "<tip>transparency",
  "<tip>penerate",
  "<tip>titlebarHeight",
  "<tip>engineCache",
  "actionSortPrompt",
] as const; //一些显示在界面上的文本

export type Role = typeof roles[number];
export type SwitchActionType = typeof switchActionTypes[number];
export type ConstantActionType = typeof constantActionTypes[number];
export type NormalActionType = typeof normalActionTypes[number];
export type TranslatorGroup = typeof translatorGroups[number];
export type MenuActionType = typeof menuActionTypes[number];
export type RouteActionType = typeof routeActionTypes[number];
export type LayoutType = typeof layoutTypes[number];
export type Domain = typeof domains[number];
export type GoogleSource = typeof googleSources[number];
export type DragCopyMode = typeof dragCopyModes[number];
export type ListenClipboardMode = typeof listenClipboardModes[number];
export type ColorMode = typeof colorModes[number];
export type EventType = typeof eventTypes[number];
export type DisplayText = typeof displayTexts[number];

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
  | TranslatorGroup
  | Category
  | DragCopyMode
  | ListenClipboardMode
  | DisplayText;

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

type ConfigItem<T> = {
  name: T;
};

function defineConfigs<T extends string>(configs: Array<ConfigItem<T>>) {
  return configs;
}

const _configs = defineConfigs(
  identifiers.map((x) => {
    return {
      name: `<tooltip>${x}`,
    };
  })
);

export type TooltipType = typeof _configs[number]["name"];

export type LocaleKey = Identifier | TooltipType;

export type MenuItemType =
  | "normal"
  | "separator"
  | "submenu"
  | "checkbox"
  | "radio";

export type ActionType =
  | "constant"
  | "config"
  | "multi_select" //多选
  | "prompt" //一些文字
  | "color_picker" //选择颜色
  | "param_normal"; //带参数的normal action

export type SubMenuGenerator = (id: string) => SubActionView[];
interface AbstractAction {
  actionType?: ActionType | MenuItemType;
  id: string;
  submenu?: Array<SubActionView>;
  subMenuGenerator?: SubMenuGenerator;
  type?: MenuItemType;
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
  cate?: Category;
}

export interface ActionInitOpt extends AbstractAction {
  id: Identifier;
  cate?: Category;
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

export function hexToRgb(hex: string) {
  return {
    r: parseInt("0x" + hex.slice(1, 3)),
    g: parseInt("0x" + hex.slice(3, 5)),
    b: parseInt("0x" + hex.slice(5, 7)),
  };
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
export type ConfigSnapshot = { [key: string]: any };
export type ConfigSnapshots = { [key: string]: ConfigSnapshot };

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

export function objToMap<T>(obj: { [key: string]: T }): Map<LocaleKey, T> {
  const strMap = new Map();
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

export const predefinedActionButtons = [
  "layoutButton",
  "copyButton",
  "closeButton",
] as const;

export type PredefinedActionButton = typeof predefinedActionButtons[number];

export interface ActionButton {
  predefined?: PredefinedActionButton;
  icon?: string;
  left_click?: string;
  right_click?: string;
  tooltip?: string;
}

export function isValidActionButton(actionButton: ActionButton): boolean {
  const keys: Array<keyof ActionButton> = [
    "icon",
    "left_click",
    "right_click",
    "tooltip",
    "predefined",
  ];
  for (const key of keys) {
    const val = actionButton[key];
    const valType = typeof val;
    if (valType != "string" && valType != "undefined") {
      return false;
    }
    if (key == "predefined" && val != undefined) {
      if (!predefinedActionButtons.includes(val as PredefinedActionButton)) {
        return false;
      }
    }
  }
  return true;
}
//取色板
export const swatches = [
  [
    "#f44336",
    "#ffebee",
    "#ffcdd2",
    "#ef9a9a",
    "#e57373",
    "#ef5350",
    "#f44336",
    "#e53935",
    "#d32f2f",
    "#c62828",
    "#b71c1c",
    "#ff8a80",
    "#ff5252",
    "#ff1744",
    "#d50000",
  ],
  [
    "#e91e63",
    "#fce4ec",
    "#f8bbd0",
    "#f48fb1",
    "#f06292",
    "#ec407a",
    "#e91e63",
    "#d81b60",
    "#c2185b",
    "#ad1457",
    "#880e4f",
    "#ff80ab",
    "#ff4081",
    "#f50057",
    "#c51162",
  ],
  [
    "#9c27b0",
    "#f3e5f5",
    "#e1bee7",
    "#ce93d8",
    "#ba68c8",
    "#ab47bc",
    "#9c27b0",
    "#8e24aa",
    "#7b1fa2",
    "#6a1b9a",
    "#4a148c",
    "#ea80fc",
    "#e040fb",
    "#d500f9",
    "#aa00ff",
  ],
  [
    "#673ab7",
    "#ede7f6",
    "#d1c4e9",
    "#b39ddb",
    "#9575cd",
    "#7e57c2",
    "#673ab7",
    "#5e35b1",
    "#512da8",
    "#4527a0",
    "#311b92",
    "#b388ff",
    "#7c4dff",
    "#651fff",
    "#6200ea",
  ],
  [
    "#3f51b5",
    "#e8eaf6",
    "#c5cae9",
    "#9fa8da",
    "#7986cb",
    "#5c6bc0",
    "#3f51b5",
    "#3949ab",
    "#303f9f",
    "#283593",
    "#1a237e",
    "#8c9eff",
    "#536dfe",
    "#3d5afe",
    "#304ffe",
  ],
  [
    "#2196f3",
    "#e3f2fd",
    "#bbdefb",
    "#90caf9",
    "#64b5f6",
    "#42a5f5",
    "#2196f3",
    "#1e88e5",
    "#1976d2",
    "#1565c0",
    "#0d47a1",
    "#82b1ff",
    "#448aff",
    "#2979ff",
    "#2962ff",
  ],
  [
    "#03a9f4",
    "#e1f5fe",
    "#b3e5fc",
    "#81d4fa",
    "#4fc3f7",
    "#29b6f6",
    "#03a9f4",
    "#039be5",
    "#0288d1",
    "#0277bd",
    "#01579b",
    "#80d8ff",
    "#40c4ff",
    "#00b0ff",
    "#0091ea",
  ],
  [
    "#00bcd4",
    "#e0f7fa",
    "#b2ebf2",
    "#80deea",
    "#4dd0e1",
    "#26c6da",
    "#00bcd4",
    "#00acc1",
    "#0097a7",
    "#00838f",
    "#006064",
    "#84ffff",
    "#18ffff",
    "#00e5ff",
    "#00b8d4",
  ],
  [
    "#009688",
    "#e0f2f1",
    "#b2dfdb",
    "#80cbc4",
    "#4db6ac",
    "#26a69a",
    "#009688",
    "#00897b",
    "#00796b",
    "#00695c",
    "#004d40",
    "#a7ffeb",
    "#64ffda",
    "#1de9b6",
    "#00bfa5",
  ],
  [
    "#4caf50",
    "#e8f5e9",
    "#c8e6c9",
    "#a5d6a7",
    "#81c784",
    "#66bb6a",
    "#4caf50",
    "#43a047",
    "#388e3c",
    "#2e7d32",
    "#1b5e20",
    "#b9f6ca",
    "#69f0ae",
    "#00e676",
    "#00c853",
  ],
  [
    "#8bc34a",
    "#f1f8e9",
    "#dcedc8",
    "#c5e1a5",
    "#aed581",
    "#9ccc65",
    "#8bc34a",
    "#7cb342",
    "#689f38",
    "#558b2f",
    "#33691e",
    "#ccff90",
    "#b2ff59",
    "#76ff03",
    "#64dd17",
  ],
  [
    "#cddc39",
    "#f9fbe7",
    "#f0f4c3",
    "#e6ee9c",
    "#dce775",
    "#d4e157",
    "#cddc39",
    "#c0ca33",
    "#afb42b",
    "#9e9d24",
    "#827717",
    "#f4ff81",
    "#eeff41",
    "#c6ff00",
    "#aeea00",
  ],
  [
    "#ffeb3b",
    "#fffde7",
    "#fff9c4",
    "#fff59d",
    "#fff176",
    "#ffee58",
    "#ffeb3b",
    "#fdd835",
    "#fbc02d",
    "#f9a825",
    "#f57f17",
    "#ffff8d",
    "#ffff00",
    "#ffea00",
    "#ffd600",
  ],
  [
    "#ffc107",
    "#fff8e1",
    "#ffecb3",
    "#ffe082",
    "#ffd54f",
    "#ffca28",
    "#ffc107",
    "#ffb300",
    "#ffa000",
    "#ff8f00",
    "#ff6f00",
    "#ffe57f",
    "#ffd740",
    "#ffc400",
    "#ffab00",
  ],
  [
    "#ff9800",
    "#fff3e0",
    "#ffe0b2",
    "#ffcc80",
    "#ffb74d",
    "#ffa726",
    "#ff9800",
    "#fb8c00",
    "#f57c00",
    "#ef6c00",
    "#e65100",
    "#ffd180",
    "#ffab40",
    "#ff9100",
    "#ff6d00",
  ],
  [
    "#ff5722",
    "#fbe9e7",
    "#ffccbc",
    "#ffab91",
    "#ff8a65",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#e64a19",
    "#d84315",
    "#bf360c",
    "#ff9e80",
    "#ff6e40",
    "#ff3d00",
    "#dd2c00",
  ],
  [
    "#795548",
    "#efebe9",
    "#d7ccc8",
    "#bcaaa4",
    "#a1887f",
    "#8d6e63",
    "#795548",
    "#6d4c41",
    "#5d4037",
    "#4e342e",
    "#3e2723",
  ],
  [
    "#9e9e9e",
    "#fafafa",
    "#f5f5f5",
    "#eeeeee",
    "#e0e0e0",
    "#bdbdbd",
    "#9e9e9e",
    "#757575",
    "#616161",
    "#424242",
    "#212121",
  ],
  [
    "#607d8b",
    "#eceff1",
    "#cfd8dc",
    "#b0bec5",
    "#90a4ae",
    "#78909c",
    "#607d8b",
    "#546e7a",
    "#455a64",
    "#37474f",
    "#263238",
  ],
  ["#ffffff", "#000000"],
] as const;

export const snapshotNameRules = [
  (value: string) => !!value || "Required.",
  (value: string) => {
    if (value == undefined) {
      return true;
    } else {
      if (value.includes("|")) {
        return 'Symbol "|" should not be used in snapshot name';
      }
      return true;
    }
  },
] as const;

export function isValidSnapshotName(text: string): boolean {
  return !snapshotNameRules.map((rule) => rule(text) == true).includes(false);
}
