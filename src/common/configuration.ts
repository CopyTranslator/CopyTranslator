import { ConfigParser } from "./configParser";
import {
  GroupRule,
  ConstantGroupRule,
  StructRule,
  UnionRule,
  ModeConfig,
  TypeRule,
  KeyConfig,
  ColorRule,
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
  GoogleSource,
  googleSources,
  DragCopyMode,
  dragCopyModes,
  isValidActionButton,
  ActionButton,
  ListenClipboardMode,
  listenClipboardModes,
} from "./types";
import { DictionaryType, dictionaryTypes } from "./dictionary/types";
import { version } from "./constant";

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.setRule("autoCopy", new TypeRule<boolean>(false));
  config.setRule("listenClipboard", new TypeRule<boolean>(true));
  config.setRule("dragCopy", new TypeRule<boolean>(false));
  config.setRule("doubleClickCopy", new TypeRule<boolean>(true));
  config.setRule("incrementalCopy", new TypeRule<boolean>(false));
  config.setRule("stayTop", new TypeRule<boolean>(true));
  config.setRule("smartDict", new TypeRule<boolean>(true));
  config.setRule("contrastDict", new TypeRule<boolean>(true));
  config.setRule("focusSource", new TypeRule<boolean>(false));
  config.setRule("smartTranslate", new TypeRule<boolean>(true));
  config.setRule("autoPaste", new TypeRule<boolean>(false));
  config.setRule("autoHide", new TypeRule<boolean>(false));
  config.setRule("autoShow", new TypeRule<boolean>(false));
  config.setRule("autoFormat", new TypeRule<boolean>(false));
  config.setRule("autoPurify", new TypeRule<boolean>(true));
  config.setRule("enableNotify", new TypeRule<boolean>(false));
  config.setRule("neverShow", new TypeRule<boolean>(false));
  config.setRule("showGoogleMessage", new TypeRule<boolean>(true));
  config.setRule("activeWindows", new TypeRule<string[]>([]));
  config.setRule(
    "dragCopyMode",
    new UnionRule<DragCopyMode>("dragCopyGlobal", dragCopyModes)
  );
  config.setRule("dragCopyWhiteList", new TypeRule<string[]>([]));
  config.setRule("dragCopyBlackList", new TypeRule<string[]>([]));

  config.setRule(
    "listenClipboardMode",
    new UnionRule<ListenClipboardMode>(
      "listenClipboardGlobal",
      listenClipboardModes
    )
  );
  config.setRule("listenClipboardWhiteList", new TypeRule<string[]>([]));
  config.setRule("listenClipboardBlackList", new TypeRule<string[]>([]));

  config.setRule("isNewUser", new TypeRule<boolean>(true));
  config.setRule("toastTip", new TypeRule<boolean>(false));
  config.setRule("closeAsQuit", new TypeRule<boolean>(true));
  config.setRule("autoCheckUpdate", new TypeRule<boolean>(true));
  config.setRule("openAtLogin", new TypeRule<boolean>(false));
  config.setRule("enableDoubleCopyTranslate", new TypeRule<boolean>(false));
  config.setRule(
    "version",
    new TypeRule<string>(version, (ver: string) => {
      return ver === version;
    })
  );

  //外观相关
  config.setRule("skipTaskbar", new TypeRule<boolean>(false));
  config.setRule("multiSource", new TypeRule<boolean>(false));
  config.setRule("drawer", new TypeRule<boolean>(true));
  config.setRule("localeSetting", new UnionRule<Language>("auto", languages));
  config.setRule(
    "hideDirect",
    new UnionRule<HideDirection>("Up", hideDirections)
  );
  config.setRule(
    "primaryColor",
    new ColorRule({ light: "#8E24AA", dark: "#8E24AA" })
  );
  config.setRule(
    "fontColor",
    new ColorRule({ light: "#000000", dark: "#FFFFFF" })
  );
  config.setRule(
    "backgroundColor",
    new ColorRule({ light: "#FFFFFF", dark: "#121212" })
  );
  config.setRule(
    "contentFontFamily",
    new TypeRule<string>(
      '"Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体"'
    )
  );
  config.setRule(
    "interfaceFontFamily",
    new TypeRule<string>(
      '"Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体"'
    )
  );
  config.setRule("colorMode", new UnionRule<ColorMode>("auto", colorModes));
  config.setRule("titlebarHeight", new TypeRule<number>(32));
  config.setRule("ignoreMouseEvents", new TypeRule<boolean>(false), false); //这个玩意儿不需要保存
  config.setRule("penerate", new TypeRule<boolean>(false)); //这个玩意儿需要保存
  config.setRule("configSnapshots", { predefined: {} });
  config.setRule(
    "transparency",
    new TypeRule<number>(0.0, (x) => x <= 1.0 && x >= 0.0)
  );

  config.setRule(
    "layoutType",
    new UnionRule<LayoutType>("horizontal", layoutTypes)
  ); //布局类型
  //下面是三种布局
  config.setRule(
    "horizontal",
    new StructRule<LayoutConfig>({
      diffFontSize: 15,
      sourceFontSize: 15,
      resultFontSize: 15,
      dictFontSize: 15,
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
      ratio: 0.5,
    })
  );

  config.setRule(
    "vertical",
    new StructRule<LayoutConfig>({
      diffFontSize: 15,
      sourceFontSize: 15,
      resultFontSize: 15,
      dictFontSize: 15,
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
      ratio: 0.5,
    })
  );

  config.setRule(
    "focus",
    new StructRule<LayoutConfig>({
      diffFontSize: 15,
      resultFontSize: 15,
      dictFontSize: 15,
      x: 535,
      y: 186,
      height: 600,
      width: 1094,
    })
  );

  config.setRule(
    //TODO 但是这里其实没有自动更新过参数
    "settings",
    new StructRule<ModeConfig>({
      x: 1390,
      y: 133,
      height: 787,
      width: 500,
    })
  );

  // 以下是一些菜单

  config.setRule(
    "tray",
    new ConstantGroupRule<Identifier>(
      [
        "configSnapshot",
        "newConfigSnapshot",
        "clear",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "incrementCounter",
        "autoHide",
        "autoShow",
        "stayTop",
        "listenClipboard",
        "dragCopy",
        "copySource",
        "copyResult",
        "settings",
        "exit",
      ],
      identifiers
    )
  );

  config.setRule(
    "contrastPanel",
    new ConstantGroupRule<Identifier>(
      [
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage",
        "translateInput",
        "settings",
      ],
      identifiers
    )
  );

  const predefinedActionButtons: ActionButton[] = [
    {
      icon: "mdi-view-quilt",
      left_click: "enumerateLayouts",
      right_click: "incrementCounter",
    },
    {
      left_click: "copyResult",
      right_click: "copySource",
      icon: "mdi-content-copy",
    },
    {
      left_click: "minimize",
      right_click: "closeWindow",
      icon: "mdi-window-minimize",
    },
  ];

  config.setRule("actionButtons", {
    predefined: predefinedActionButtons,
    check: (vals: ActionButton[]) =>
      !vals.map(isValidActionButton).includes(false),
    minimalVersion: "v11.0.0",
  });

  //不要在config里存放过于复杂的东西，老老实实用store的action

  //与翻译有关的
  config.setRule(
    "translatorType",
    new UnionRule<TranslatorType>("google", translatorTypes)
  );
  config.setRule(
    "dictionaryType",
    new UnionRule<DictionaryType>("youdao", dictionaryTypes)
  );
  config.setRule("sourceLanguage", new UnionRule<Language>("en", languages));
  config.setRule("targetLanguage", new UnionRule<Language>("zh-CN", languages));
  config.setRule(
    "googleMirror",
    new TypeRule<string>("https://gtranslate.cdn.haah.net")
  );
  config.setRule(
    "googleSource",
    new UnionRule<GoogleSource>("google", googleSources, "v11.0.0")
  );
  config.setRule(
    "fallbackTranslator",
    new UnionRule<TranslatorType>("baidu", translatorTypes)
  );
  config.setRule("pasteDelay", new TypeRule<number>(0.0));

  config.setRule(
    "translator-enabled", //所有启用的引擎
    new GroupRule<TranslatorType>(
      [
        "google",
        "baidu",
        "caiyun",
        "keyan",
        "bing",
        "deepl",
        "tencent",
        "youdao",
        "sogou",
      ],
      translatorTypes,
      "v11.0.0"
    )
  );

  config.setRule(
    "translator-cache", //所有会自动查询并缓存结果以加速切换的翻译引擎
    new GroupRule<TranslatorType>(
      [
        // "google",
        // "baidu",
        // "caiyun",
        // "keyan",
        // "bing",
        // "deepl",
        // "tencent",
        // "youdao",
        // "sogou",
      ],
      translatorTypes,
      "v11.0.0"
    )
  );

  config.setRule(
    "translator-compare", //多源对比时用的引擎
    new GroupRule<TranslatorType>(
      [
        "google",
        "baidu",
        "caiyun",
        "keyan",
        "bing",
        "deepl",
        "tencent",
        "youdao",
        "sogou",
      ],
      translatorTypes,
      "v11.0.0"
    )
  );

  config.setRule(
    "translator-double",
    new GroupRule<TranslatorType>([], translatorTypes)
  );

  //下面是N种翻译引擎
  config.setRule(
    "baidu",
    new StructRule<KeyConfig>({ appid: "", key: "" })
  );

  config.setRule(
    "baidu-ocr",
    new StructRule<KeyConfig>({ app_id: "", api_key: "", secret_key: "" })
  );

  config.setRule(
    "pp-ocr",
    new StructRule<KeyConfig>({ cwd: "", config_name: "" })
  );

  config.setRule(
    "baidu-domain",
    new StructRule<KeyConfig>({ appid: "", key: "", domain: "" })
  );

  // config.setRule(
  //   "caiyun",
  //   new StructRule<KeyConfig>({ token: "" }, "parameters of caiyun")
  // );

  config.setRule(
    "google",
    new StructRule<KeyConfig>({ token: "" })
  );

  config.setRule(
    "sogou",
    new StructRule<KeyConfig>({ pid: "", key: "" })
  );

  // config.setRule(
  //   "tencent",
  //   new StructRule<KeyConfig>(
  //     { secretId: "", secretKey: "" },
  //     "parameters of tencent"
  //   )
  // );

  config.setRule(
    "youdao",
    new StructRule<KeyConfig>({ appKey: "", key: "" })
  );

  return config;
}

export { initConfig, ConfigParser };
const config = initConfig();
export default config;
