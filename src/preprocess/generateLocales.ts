var fs = require("fs");
var path = require("path");
interface Locale {
  localeName: string;
  stayTop: string;
  listenClipboard: string;
  autoCopy: string;
  smartDict: string;
  translate: string;
  copySource: string;
  copyResult: string; //复制结果
  source: string; // 原文
  result: string; //译文
  sourceLanguage: string;
  targetLanguage: string;
  detectLanguage: string;
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
}

const zh_cn = {
  localeName: "简体中文",
  stayTop: "总是置顶",
  listenClipboard: "监听剪贴板",
  autoCopy: "自动复制",
  smartDict: "智能词典",
  translate: "翻译",
  copySource: "复制原文",
  copyResult: "复制译文", //复制结果
  source: "原文", // 原文
  result: "译文", //译文
  sourceLanguage: "源语言",
  targetLanguage: "目标语言",
  detectLanguage: "检测语言",
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
  viewSource: "查看原文"
};

const en = {
  localeName: "English",
  stayTop: "Stay on top",
  listenClipboard: "Listen Clipboard",
  autoCopy: "Auto Copy",
  smartDict: "Smart Dict",
  translate: "Translate",
  copySource: "Copy Source",
  copyResult: "Copy Result", //复制结果
  source: "Source", // 原文
  result: "Result", //译文
  sourceLanguage: "Source Language",
  targetLanguage: "Target Language",
  detectLanguage: "Detected Language",
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
  viewSource: "View Source"
};

const localeDir = path.join(process.cwd(), "dist_locales");

function generateLocales(
  locales: { [key: string]: Locale },
  localeDir: string
) {
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir);
  }
  for (let key in locales) {
    fs.writeFileSync(
      path.join(localeDir, key + ".json"),
      JSON.stringify(locales[key], null, 4)
    );
  }
}

// prettier-ignore
generateLocales({
  "en": en,
  "zh-cn": zh_cn
},localeDir);
