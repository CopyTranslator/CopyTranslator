interface Locale {
  localeName: string;
  stayTop: string;
  listenClipboard: string;
  autoCopy: string;
  autoPaste: string;
  autoPurify: string;
  incrementalCopy: string;
  smartDict: string;
  translate: string;
  copySource: string;
  copyResult: string; //复制结果
  dragCopy: string;
  source: string; // 原文
  result: string; //译文
  sourceLanguage: string;
  targetLanguage: string;
  detectLanguage: string;
  languageDetected: string;
  clear: string;
  helpAndUpdate: string;
  exit: string;
  contrastMode: string;
  focusMode: string;
  switchMode: string;
  autoHide: string;
  autoFormat: string;
  autoShow: string;
  settings: string;
  viewSource: string;
  localeSetting: string;
  return: string;
  retryTranslate: string;
  hideDirect: string;
  translatorType: string;
  evaluate: string;
  homepage: string;
  userManual: string;
  checkUpdate: string;
  toDownload: string;
  changelog: string;
  cancel: string;
  ok: string;
  restoreDefault: string;
  enableNotify: string;
  smartTranslate: string;
  API_KEY: string;
  APP_ID: string;
  SECRET_KEY: string;
  capture: string;
  OCRConfig: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  pasteAndMatchStyle: string;
  selectAll: string;
  delete: string;
  minimize: string;
  close: string;
  quit: string;
  reload: string;
  forcereload: string;
  toggledevtools: string;
  toggleFullScreen: string;
  resetzoom: string;
  zoomin: string;
  zoomout: string;
  editMenu: string;
  windowMenu: string;
  switches: string;
  options: string;
  skipTaskbar: string;
}

const zh_cn: Locale = {
  localeName: "简体中文",
  stayTop: "总是置顶",
  listenClipboard: "监听剪贴板",
  autoCopy: "自动复制",
  autoPaste: "自动粘贴",
  autoPurify: "自动净化",
  incrementalCopy: "增量复制",
  smartDict: "智能词典",
  translate: "翻译",
  copySource: "复制原文",
  copyResult: "复制译文", //复制结果
  source: "原文", // 原文
  result: "译文", //译文
  sourceLanguage: "源语言",
  targetLanguage: "目标语言",
  detectLanguage: "检测语言",
  languageDetected: "检测到语言",
  clear: "清空",
  helpAndUpdate: "帮助与更新",
  exit: "退出",
  contrastMode: "对照模式",
  focusMode: "专注模式",
  switchMode: "切换模式",
  autoHide: "自动隐藏",
  autoFormat: "自动格式化",
  autoShow: "自动显示",
  settings: "设置",
  viewSource: "查看原文",
  localeSetting: "区域设置",
  return: "返回",
  retryTranslate: "重试翻译",
  dragCopy: "拖拽复制",
  hideDirect: "隐藏方向",
  translatorType: "翻译器",
  evaluate: "评估",
  homepage: "官网",
  userManual: "用户手册",
  checkUpdate: "检查更新",
  toDownload: "前往下载",
  changelog: "更新日志",
  cancel: "取消",
  ok: "确定",
  restoreDefault: "恢复默认设置",
  enableNotify: "启用通知",
  smartTranslate: "智能互译",
  APP_ID: "APP_ID",
  API_KEY: "API_KEY",
  SECRET_KEY: "SECRET_KEY",
  capture: "截图翻译",
  OCRConfig: "OCR 设置",
  undo: "撤销",
  redo: "重做",
  cut: "剪切",
  copy: "复制",
  paste: "粘贴",
  pasteAndMatchStyle: "粘贴并匹配样式",
  selectAll: "全选",
  delete: "删除",
  minimize: "最小化",
  close: "关闭",
  quit: "退出",
  reload: "重载",
  forcereload: "强制重载",
  toggledevtools: "开启开发者工具",
  toggleFullScreen: "开启全屏",
  resetzoom: "重置缩放",
  zoomin: "放大",
  zoomout: "缩小",
  editMenu: "编辑菜单",
  windowMenu: "窗口菜单",
  switches: "开关",
  options: "选项",
  skipTaskbar: "隐藏任务栏"
};

const en: Locale = {
  localeName: "English",
  stayTop: "Stay on top",
  listenClipboard: "Listen Clipboard",
  autoCopy: "Auto Copy",
  autoPaste: "Auto Paste",
  autoPurify: "Auto Purify",
  incrementalCopy: "Incremental Copy",
  smartDict: "Smart Dict",
  translate: "Translate",
  copySource: "Copy Source",
  copyResult: "Copy Result", //复制结果
  source: "Source", // 原文
  result: "Result", //译文
  sourceLanguage: "Source Language",
  targetLanguage: "Target Language",
  detectLanguage: "Detect Language",
  languageDetected: "Language detected",
  clear: "Clear",
  helpAndUpdate: "Help And Update",
  exit: "Exit",
  contrastMode: "Contrast Mode",
  focusMode: "Focus Mode",
  switchMode: "Switch Mode",
  autoHide: "Auto Hide",
  autoFormat: "Auto Format",
  autoShow: "Auto Show",
  settings: "Settings",
  viewSource: "View Source",
  localeSetting: "Locale",
  return: "Return",
  retryTranslate: "Retry Translate",
  dragCopy: "Drag Copy",
  hideDirect: "Hide Direction",
  translatorType: "Translator Type",
  evaluate: "Evaluate",
  homepage: "Homepage",
  userManual: "User Manual",
  checkUpdate: "Check Update",
  toDownload: "To Download",
  changelog: "Change Log",
  cancel: "Cancel",
  ok: "OK",
  restoreDefault: "Restore default settings",
  enableNotify: "Enable Notify",
  smartTranslate: "Smart Translate",
  APP_ID: "APP_ID",
  API_KEY: "API_KEY",
  SECRET_KEY: "SECRET_KEY",
  capture: "Screenshot Translate",
  OCRConfig: "OCR Config",
  undo: "undo",
  redo: "redo",
  cut: "cut",
  copy: "copy",
  paste: "paste",
  pasteAndMatchStyle: "pasteAndMatchStyle",
  selectAll: "selectAll",
  delete: "delete",
  minimize: "minimize",
  close: "close",
  quit: "quit",
  reload: "reload",
  forcereload: "forcereload",
  toggledevtools: "toggledevtools",
  toggleFullScreen: "toggleFullScreen",
  resetzoom: "resetzoom",
  zoomin: "zoomin",
  zoomout: "zoomout",
  editMenu: "editMenu",
  windowMenu: "windowMenu",
  switches: "Switches",
  options: "Options",
  skipTaskbar: "Skip Taskbar"
};

export { en, zh_cn, Locale };
