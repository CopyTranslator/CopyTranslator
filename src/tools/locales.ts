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
  tapCopy: string;
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
  titleBar: string;
  API_KEY: string;
  APP_ID: string;
  SECRET_KEY: string;
  capture: string;
  ApiConfig: string;
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
  tapCopy: "点按复制",
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
  titleBar: "标题栏样式",
  APP_ID: "APP_ID",
  API_KEY: "API_KEY",
  SECRET_KEY: "SECRET_KEY",
  capture: "截图",
  ApiConfig: "API 设置"
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
  tapCopy: "Tap Copy",
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
  titleBar: "titleBar",
  APP_ID: "APP_ID",
  API_KEY: "API_KEY",
  SECRET_KEY: "SECRET_KEY",
  capture: "capture",
  ApiConfig: "API Config"
};

export { en, zh_cn, Locale };
