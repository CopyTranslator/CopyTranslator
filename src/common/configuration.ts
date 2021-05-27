import { ConfigParser } from "./configParser";
import {
  GroupRule,
  StructRule,
  UnionRule,
  ModeConfig,
  TypeRule,
  KeyConfig,
  LayoutConfig,
} from "./rule";
import { languages, Language } from "@opentranslate/languages";

import {
  translatorTypes,
  TranslatorType,
  Identifier,
  identifiers,
  LayoutType,
  layoutTypes,
  ColorMode,
  colorModes,
  HideDirection,
  hideDirections,
} from "./types";
import { DictionaryType, dictionaryTypes } from "./dictionary/types";
import { version } from "./constant";

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.setRule(
    "autoCopy",
    new TypeRule<boolean>(false, "auto copy result to clipboard")
  );

  config.setRule(
    "listenClipboard",
    new TypeRule<boolean>(true, "Listen to Clipboard")
  );

  config.setRule(
    "dragCopy",
    new TypeRule<boolean>(false, "catch simulate copy")
  );

  config.setRule(
    "doubleClickCopy",
    new TypeRule<boolean>(true, "double click copy")
  );

  config.setRule(
    "incrementalCopy",
    new TypeRule<boolean>(false, "incremental copy")
  );
  config.setRule("stayTop", new TypeRule<boolean>(false, "always stay on top"));
  config.setRule("smartDict", new TypeRule<boolean>(true, "smart dict"));
  config.setRule(
    "contrastDict",
    new TypeRule<boolean>(true, "dict on contrast")
  );
  config.setRule(
    "smartTranslate",
    new TypeRule<boolean>(true, "smart translate")
  );

  config.setRule(
    "autoPaste",
    new TypeRule<boolean>(false, "auto paste after translate")
  );

  config.setRule(
    "autoHide",
    new TypeRule<boolean>(false, "auto hide when close to edge")
  );

  config.setRule(
    "autoShow",
    new TypeRule<boolean>(false, "auto show after translate")
  );

  config.setRule(
    "autoFormat",
    new TypeRule<boolean>(false, "auto replace the contene in clipboard")
  );

  config.setRule(
    "autoPurify",
    new TypeRule<boolean>(true, "remove extra linebreak when translate")
  );

  config.setRule(
    "enableNotify",
    new TypeRule<boolean>(false, "notify after translate")
  );
  config.setRule(
    "skipTaskbar",
    new TypeRule<boolean>(false, "hide the taskbar")
  );
  config.setRule(
    "neverShow",
    new TypeRule<boolean>(false, "never show warning")
  );
  config.setRule("toastTip", new TypeRule<boolean>(false, "action toast tip"));

  config.setRule("drawer", new TypeRule<boolean>(false, "never show warning"));

  config.setRule("closeAsQuit", new TypeRule<boolean>(true, "close as quit"));

  config.setRule(
    "autoCheckUpdate",
    new TypeRule<boolean>(true, "auto check update after startup")
  );

  config.setRule(
    "openAtLogin",
    new TypeRule<boolean>(false, "auto start at login")
  );

  config.setRule(
    "multiSource",
    new TypeRule<boolean>(false, "show multi source result")
  );

  config.setRule(
    "enableDoubleCopyTranslate",
    new TypeRule<boolean>(false, "enable Double Ctrl+C Translate")
  );

  config.setRule(
    "translatorType",
    new UnionRule<TranslatorType>(
      "google",
      "type of translator",
      translatorTypes
    )
  );

  config.setRule(
    "version",
    new TypeRule<string>(version, "current version", (ver: string) => {
      return ver === version;
    })
  );

  config.setRule(
    "dictionaryType",
    new UnionRule<DictionaryType>(
      "youdao",
      "type of dictionary",
      dictionaryTypes
    )
  );

  config.setRule(
    "layoutType",
    new UnionRule<LayoutType>("horizontal", "type of layout", layoutTypes)
  );

  config.setRule(
    "hideDirect",
    new UnionRule<HideDirection>("Up", "HideDirection", hideDirections)
  );

  config.setRule(
    "colorMode",
    new UnionRule<ColorMode>("auto", "color mode", colorModes)
  );

  config.setRule(
    "contrast",
    new StructRule<ModeConfig>(
      {
        x: 535,
        y: 186,
        height: 600,
        width: 1094,
      },
      "parameters of contrast mode"
    )
  );

  config.setRule(
    "settings",
    new StructRule<ModeConfig>(
      {
        x: 1390,
        y: 133,
        height: 787,
        width: 362,
      },
      "parameters of setting panel"
    )
  );

  config.setRule(
    "sourceLanguage",
    new UnionRule<Language>("en", "sourceLanguage language", languages)
  );

  config.setRule(
    "targetLanguage",
    new UnionRule<Language>("zh-CN", "targetLanguage language", languages)
  );

  config.setRule(
    "localeSetting",
    new UnionRule<Language>("auto", "localeSetting setting", languages)
  );

  config.setRule(
    "translator-auto",
    new GroupRule<TranslatorType>(
      ["google", "baidu", "youdao", "caiyun", "tencent"],
      "auto call",
      translatorTypes
    )
  );

  config.setRule(
    "translator-double",
    new GroupRule<TranslatorType>(
      ["baidu-domain"],
      "manually call",
      translatorTypes
    )
  );

  config.setRule(
    "focusRight",
    new GroupRule<Identifier>(
      [
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "settings",
        "exit",
      ],
      "the context menu of focus mode",
      identifiers
    )
  );

  config.setRule(
    "tray",
    new GroupRule<Identifier>(
      [
        "translatorType",
        "dictionaryType",
        "hideDirect",
        "copySource",
        "copyResult",
        "pasteResult",
        "clear",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "enableNotify",
        "settings",
        "helpAndUpdate",
        "exit",
      ],
      "the menu of tray",
      identifiers
    )
  );

  config.setRule(
    "contrastPanel",
    new GroupRule<Identifier>(
      [
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "enableNotify",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage",
        "settings",
      ],
      "the options of contrast mode",
      identifiers
    )
  );

  //下面是N种翻译引擎
  config.setRule(
    "baidu",
    new StructRule<KeyConfig>({ appid: "", key: "" }, "parameters of baidu")
  );

  config.setRule(
    "baidu-ocr",
    new StructRule<KeyConfig>(
      { app_id: "", api_key: "", secret_key: "" },
      "parameters of baidu-ocr"
    )
  );

  config.setRule(
    "baidu-domain",
    new StructRule<KeyConfig>(
      { appid: "", key: "", domain: "" },
      "parameters of baidu-domain"
    )
  );

  config.setRule(
    "caiyun",
    new StructRule<KeyConfig>({ token: "" }, "parameters of caiyun")
  );

  config.setRule(
    "google",
    new StructRule<KeyConfig>({ token: "" }, "parameters of google")
  );

  // config.setRule(
  //   "sogou",
  //   new StructRule<KeyConfig>({ pid: "", key: "" }, "parameters of sogou")
  // );

  config.setRule(
    "tencent",
    new StructRule<KeyConfig>(
      { secretId: "", secretKey: "" },
      "parameters of tencent"
    )
  );

  config.setRule(
    "youdao",
    new StructRule<KeyConfig>({ appKey: "", key: "" }, "parameters of youdao")
  );

  //下面是三种布局
  config.setRule(
    "horizontal",
    new StructRule<LayoutConfig>(
      { fontSize: 15, x: 535, y: 186, height: 600, width: 1094 },
      "layout config"
    )
  );

  config.setRule(
    "vertical",
    new StructRule<LayoutConfig>(
      { fontSize: 15, x: 535, y: 186, height: 600, width: 1094 },
      "layout config"
    )
  );

  config.setRule(
    "focus",
    new StructRule<LayoutConfig>(
      { fontSize: 15, x: 535, y: 186, height: 600, width: 1094 },
      "layout config"
    )
  );

  return config;
}

export { initConfig, ConfigParser };
const config = initConfig();
export default config;
