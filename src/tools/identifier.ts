export const identifiers = [
  "skipTaskbar",
  "localeName",
  "stayTop",
  "listenClipboard",
  "autoCopy",
  "autoPaste",
  "autoPurify",
  "incrementalCopy",
  "smartDict",
  "translate",
  "copySource",
  "copyResult",
  "dragCopy",
  "source",
  "result",
  "sourceLanguage",
  "targetLanguage",
  "detectLanguage",
  "languageDetected",
  "clear",
  "helpAndUpdate",
  "exit",
  "contrastMode",
  "focusMode",
  "switchMode",
  "autoHide",
  "autoFormat",
  "autoShow",
  "settings",
  "viewSource",
  "localeSetting",
  "return",
  "retryTranslate",
  "hideDirect",
  "translatorType",
  "evaluate",
  "homepage",
  "userManual",
  "checkUpdate",
  "toDownload",
  "changelog",
  "cancel",
  "ok",
  "restoreDefault",
  "enableNotify",
  "smartTranslate",
  "API_KEY",
  "APP_ID",
  "SECRET_KEY",
  "capture",
  "OCRConfig",
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
  "forcereload",
  "toggledevtools",
  "toggleFullScreen",
  "resetzoom",
  "zoomin",
  "zoomout",
  "editMenu",
  "windowMenu",
  "switches",
  "options",
  "frameMode",
  "focus",
  "contrast",
  "settingsConfig",
  "contrastMenu",
  "focusMenu",
  "trayMenu",
  "contrastOption",
  "notices"
] as const;

export type Identifier = (typeof identifiers)[number];
export function mapToObj<T>(strMap: Map<Identifier, T>): { [key: string]: T } {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

export function objToMap<T>(obj: { [key: string]: T }): Map<Identifier, T> {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
