import { ConfigParser } from "./configParser";
import {
  GroupRule,
  ConstantGroupRule,
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
  GoogleSource,
  googleSources,
  DragCopyMode,
  dragCopyModes,
} from "./types";
import { DictionaryType, dictionaryTypes } from "./dictionary/types";
import { version } from "./constant";

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.setRule(
    "autoCopy",
    new TypeRule<boolean>(false, "翻译后自动复制翻译结果到剪贴板")
  );

  config.setRule(
    "listenClipboard",
    new TypeRule<boolean>(true, "监听并翻译剪贴板内容")
  );

  config.setRule(
    "dragCopy",
    new TypeRule<boolean>(false, "拖拽后模拟复制选中内容")
  );

  config.setRule(
    "doubleClickCopy",
    new TypeRule<boolean>(true, "双击复制选中内容")
  );

  config.setRule(
    "incrementalCopy",
    new TypeRule<boolean>(false, "将新复制的内容附加到之前的原文后")
  );
  config.setRule(
    "stayTop",
    new TypeRule<boolean>(true, "界面始终保持在最上层")
  );
  config.setRule("smartDict", new TypeRule<boolean>(true, ""));
  config.setRule(
    "contrastDict",
    new TypeRule<boolean>(true, "在非专注模式显示词典")
  );
  config.setRule("smartTranslate", new TypeRule<boolean>(true, "智能互译"));

  config.setRule(
    "autoPaste",
    new TypeRule<boolean>(false, "翻译后模拟Ctrl+V粘贴")
  );

  config.setRule(
    "autoHide",
    new TypeRule<boolean>(false, "贴近屏幕边缘时自动隐藏")
  );

  config.setRule("autoShow", new TypeRule<boolean>(false, "翻译后自动显示"));

  config.setRule(
    "autoFormat",
    new TypeRule<boolean>(
      false,
      "去除剪贴板的文本的格式问题（会覆盖剪贴板内容）"
    )
  );

  config.setRule(
    "autoPurify",
    new TypeRule<boolean>(true, "翻译时处理剪贴板的格式问题")
  );

  config.setRule(
    "enableNotify",
    new TypeRule<boolean>(false, "notify after translate")
  );
  config.setRule("skipTaskbar", new TypeRule<boolean>(false, "隐藏状态栏"));
  config.setRule("neverShow", new TypeRule<boolean>(false, "不再显示警告"));

  config.setRule(
    "showGoogleMessage",
    new TypeRule<boolean>(true, "show google message")
  );

  config.setRule(
    "activeWindows",
    new TypeRule<string[]>([], "info about active window")
  );

  config.setRule(
    "dragCopyMode",
    new UnionRule<DragCopyMode>(
      "dragCopyGlobal",
      "推荐使用白名单模式，只在特定应用响应拖拽复制",
      dragCopyModes
    )
  );
  config.setRule("dragCopyWhiteList", new TypeRule<string[]>([], ""));
  config.setRule("dragCopyBlackList", new TypeRule<string[]>([], ""));

  config.setRule(
    "isNewUser",
    new TypeRule<boolean>(true, "this is the first start up of a new user")
  );

  config.setRule("toastTip", new TypeRule<boolean>(false, "提示"));

  config.setRule("drawer", new TypeRule<boolean>(true, ""));

  config.setRule(
    "closeAsQuit",
    new TypeRule<boolean>(true, "关闭窗口即完全退出，而非最小化到托盘")
  );

  config.setRule(
    "autoCheckUpdate",
    new TypeRule<boolean>(true, "启动时自动检查更新")
  );

  config.setRule("openAtLogin", new TypeRule<boolean>(false, ""));

  config.setRule(
    "multiSource",
    new TypeRule<boolean>(false, "同时显示并对比多个引擎的翻译结果")
  );

  config.setRule(
    "enableDoubleCopyTranslate",
    new TypeRule<boolean>(
      false,
      "双击Ctrl+C触发翻译，可以在关闭监听剪贴板时使用"
    )
  );

  config.setRule(
    "translatorType",
    new UnionRule<TranslatorType>("google", "", translatorTypes)
  );

  config.setRule(
    "fallbackTranslator",
    new UnionRule<TranslatorType>(
      "baidu",
      "后备翻译引擎，当前引擎不支持此语言时启用",
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
    new UnionRule<DictionaryType>("youdao", "", dictionaryTypes)
  );

  config.setRule(
    "layoutType",
    new UnionRule<LayoutType>("horizontal", "", layoutTypes)
  );

  config.setRule(
    "hideDirect",
    new UnionRule<HideDirection>("Up", "", hideDirections)
  );

  config.setRule(
    "colorMode",
    new UnionRule<ColorMode>(
      "auto",
      "明亮或者是暗黑模式，自动则跟随系统",
      colorModes
    )
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
    //TODO 但是这里其实没有自动更新过参数
    "settings",
    new StructRule<ModeConfig>(
      {
        x: 1390,
        y: 133,
        height: 787,
        width: 500,
      },
      "parameters of setting panel"
    )
  );

  config.setRule(
    "sourceLanguage",
    new UnionRule<Language>("en", "", languages)
  );

  config.setRule(
    "targetLanguage",
    new UnionRule<Language>("zh-CN", "", languages)
  );

  config.setRule(
    "localeSetting",
    new UnionRule<Language>(
      "auto",
      "界面显示的语言，默认是自动检测系统语言",
      languages
    )
  );

  config.setRule(
    "translator-enabled", //所有启用的的引擎
    new GroupRule<TranslatorType>(
      ["google", "baidu", "caiyun", "keyan", "bing", "deepl", "tencent"],
      "所有启用的的引擎，可以关闭某些不常用引擎以节省资源",
      translatorTypes,
      "v10.2.4"
    )
  );

  config.setRule(
    "translator-cache", //所有会自动查询并缓存结果以加速切换的翻译引擎
    new GroupRule<TranslatorType>(
      ["google", "baidu", "caiyun", "keyan", "bing", "deepl", "tencent"],
      "所有会自动查询并缓存结果以加速切换的翻译引擎",
      translatorTypes,
      "v10.2.4"
    )
  );

  config.setRule(
    "translator-compare", //多源对比时用的引擎
    new GroupRule<TranslatorType>(
      ["google", "baidu", "caiyun", "keyan", "bing", "deepl", "tencent"],
      "多源对比时用的引擎",
      translatorTypes,
      "v10.2.4"
    )
  );

  config.setRule(
    "translator-double",
    new ConstantGroupRule<TranslatorType>(
      ["baidu-domain"],
      "需要手动调用的引擎，目前应该是没啥用",
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
    new ConstantGroupRule<Identifier>(
      [
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
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "settings",
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
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage",
        "translateInput",
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
    "pp-ocr",
    new StructRule<KeyConfig>(
      { cwd: "", config_name: "" },
      "parameters of pp-ocr"
    )
  );

  config.setRule(
    "baidu-domain",
    new StructRule<KeyConfig>(
      { appid: "", key: "", domain: "" },
      "parameters of baidu-domain"
    )
  );

  // config.setRule(
  //   "caiyun",
  //   new StructRule<KeyConfig>({ token: "" }, "parameters of caiyun")
  // );

  config.setRule(
    "google",
    new StructRule<KeyConfig>({ token: "" }, "parameters of google")
  );

  // config.setRule(
  //   "sogou",
  //   new StructRule<KeyConfig>({ pid: "", key: "" }, "parameters of sogou")
  // );

  // config.setRule(
  //   "tencent",
  //   new StructRule<KeyConfig>(
  //     { secretId: "", secretKey: "" },
  //     "parameters of tencent"
  //   )
  // );

  // config.setRule(
  //   "youdao",
  //   new StructRule<KeyConfig>({ appKey: "", key: "" }, "parameters of youdao")
  // );

  //下面是三种布局
  config.setRule(
    "horizontal",
    new StructRule<LayoutConfig>(
      {
        diffFontSize: 15,
        fontSize: 15,
        x: 535,
        y: 186,
        height: 600,
        width: 1094,
      },
      "layout config"
    )
  );

  config.setRule(
    "vertical",
    new StructRule<LayoutConfig>(
      {
        diffFontSize: 15,
        fontSize: 15,
        x: 535,
        y: 186,
        height: 600,
        width: 1094,
      },
      "layout config"
    )
  );

  config.setRule(
    "focus",
    new StructRule<LayoutConfig>(
      {
        diffFontSize: 15,
        fontSize: 15,
        x: 535,
        y: 186,
        height: 600,
        width: 1094,
      },
      "layout config"
    )
  );

  config.setRule("pasteDelay", new TypeRule<number>(0.0, ""));

  config.setRule(
    "googleMirror",
    new TypeRule<string>(
      "https://gtranslate.cdn.haah.net",
      "谷歌翻译API镜像URL，置空则恢复到谷歌官方API的URL"
    )
  );

  config.setRule(
    "googleSource",
    new UnionRule<GoogleSource>(
      "google",
      "google应该是最快的，其他的可能稍慢，但是如果google用不了可以试试别的",
      googleSources,
      "v10.2.4"
    )
  );

  return config;
}

export { initConfig, ConfigParser };
const config = initConfig();
export default config;
