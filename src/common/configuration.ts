import { ConfigParser } from "./configParser";
import {
  GroupRule,
  ConstantGroupRule,
  StructRule,
  UnionRule,
  FlexibleUnionRule,
  ModeConfig,
  TypeRule,
  KeyConfig,
  ColorRule,
  LayoutConfig,
  CheckResult,
  NetworkProxyConfig,
} from "./rule";
import { languages, Language } from "@opentranslate2/languages";
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
  DragCopyMode,
  dragCopyModes,
  isValidActionButton,
  ActionButton,
  ListenClipboardMode,
  listenClipboardModes,
  domains,
  GoogleSource,
  googleSourceOptions,
  temperatureOptions,
  maxTokensOptions,
} from "./types";
import { DictionaryType, dictionaryTypes } from "./dictionary/types";
import { version } from "./constant";


function is_empty_string(str: string): boolean {
  return !str || str.length === 0;
}

function getInvalidStringKeys(value: KeyConfig): string[] {
  const invalidKeys: string[] = [];
  for (const key in value) {
    if (typeof value[key] !== "string") {
      invalidKeys.push(key);
    }
  }
  return invalidKeys;
}

function getEmptyKeys(value: KeyConfig): string[] {
  const emptyKeys: string[] = [];
  for (const key in value) {
    if (is_empty_string(value[key])) {
      emptyKeys.push(key);
    }
  }
  return emptyKeys;
}

function googleCheck(value: KeyConfig): CheckResult {
  const invalidKeys = getInvalidStringKeys(value);
  if (invalidKeys.length > 0) {
    const reason = `字段类型无效: ${invalidKeys.join(", ")}`;
    return { canSave: false, canEnable: false, saveReason: reason, enableReason: reason };
  }
  const source = value.source;
  if (is_empty_string(source)) {
    return {
      canSave: false,
      canEnable: false,
      saveReason: "翻译源不能为空",
      enableReason: "翻译源不能为空",
    };
  }
  if (!googleSourceOptions.includes(source as GoogleSource)) {
    return {
      canSave: false,
      canEnable: false,
      saveReason: "翻译源无效",
      enableReason: "翻译源无效",
    };
  }
  return { canSave: true, canEnable: true };
}

// 检查是否全空或全填写
function emptyOrAllCheck(value: KeyConfig): CheckResult {
  const invalidKeys = getInvalidStringKeys(value);
  if (invalidKeys.length > 0) {
    const reason = `字段类型无效: ${invalidKeys.join(", ")}`;
    return { canSave: false, canEnable: false, saveReason: reason, enableReason: reason };
  }
  const emptyKeys = getEmptyKeys(value);
  const allEmpty = emptyKeys.length === Object.keys(value).length;
  const allFilled = emptyKeys.length === 0;
  if (allEmpty) { // 全空也行，就用系统默认的
    return {
      canSave: true,
      canEnable: true,
    };
  }
  // 全部填写也行
  if (allFilled) {
    return { canSave: true, canEnable: true };
  }
  return {
    canSave: false,
    canEnable: false,
    saveReason: "要么全填写所有字段，要么全不填写",
    enableReason: "要么全填写所有字段，要么全不填写",
  };
}


function generalCheck(value: KeyConfig): CheckResult {
  const invalidKeys = getInvalidStringKeys(value);
  if (invalidKeys.length > 0) {
    const reason = `字段类型无效: ${invalidKeys.join(", ")}`;
    return { canSave: false, canEnable: false, saveReason: reason, enableReason: reason };
  }
  const emptyKeys = getEmptyKeys(value);
  if (emptyKeys.length === 0) {
    return { canSave: true, canEnable: true };
  }
  return {
    canSave: true,
    canEnable: false,
    enableReason: `请填写: ${emptyKeys.join(", ")}`,
  };
}

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.setRule("autoCopy", new TypeRule<boolean>(false));
  config.setRule("listenClipboard", new TypeRule<boolean>(true));
  config.setRule("enableOCR", new TypeRule<boolean>(true)); // 启用 OCR
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
  config.setRule("neverShowTips", new TypeRule<boolean>(false)); // 不显示提示
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
  config.setRule("enableNetworkProxy", new TypeRule<boolean>(false));
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
    "settings",
    new StructRule<ModeConfig>({
      x: 1390,
      y: 133,
      height: 787,
      width: 500,
    })
  );

  config.setRule(
    "networkProxy",
    new StructRule<NetworkProxyConfig>(
      {
        host: "127.0.0.1",
        port: 7890,
        protocol: "http",
        username: "",
        password: ""
      },
      undefined,
      {
        host: { uiType: "text", label: "proxyHost" },
        port: { uiType: "number", label: "proxyPort" },
        protocol: { uiType: "select", options: ["http", "socks5"], label: "proxyProtocol" },
        username: { uiType: "text", label: "proxyUsername" },
        password: { uiType: "text", label: "proxyPassword" }
      },
      "networkProxyPrompt"
    )
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
    new FlexibleUnionRule<TranslatorType>("baidu", translatorTypes)
  );
  config.setRule(
    "dictionaryType",
    new UnionRule<DictionaryType>("youdao", dictionaryTypes)
  );
  config.setRule("sourceLanguage", new UnionRule<Language>("en", languages));
  config.setRule("targetLanguage", new UnionRule<Language>("zh-CN", languages));

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
        "stepfun",
      ],
      translatorTypes,
      "v12.1.0"
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
        // "stepfun",
        // "bing",
        // "deepl",
        // "tencent",
        // "youdao",
        // "sogou",
      ],
      translatorTypes,
      "v12.0.0"
    )
  );

  config.setRule(
    "translator-compare", //多源对比时用的引擎
    new GroupRule<TranslatorType>(
      [
        "google",
        "baidu",
        "caiyun",
        "stepfun",
        "youdao",
        "sogou",
      ],
      translatorTypes,
      "v12.1.0"
    )
  );

  config.setRule(
    "translator-double",
    new GroupRule<TranslatorType>([], translatorTypes)
  );

  //下面是N种翻译引擎
  config.setRule(
    "baidu",
    new StructRule<KeyConfig>(
      { appid: "", key: "" },
      emptyOrAllCheck,
      undefined,
      "baiduConfigNote",
      "https://fanyi-api.baidu.com/doc/21"
    )
  );

  config.setRule(
    "baidu-ocr",
    new StructRule<KeyConfig>(
      { app_id: "", api_key: "", secret_key: "" },
      undefined,
      undefined,
      undefined,
      "https://ai.baidu.com/tech/ocr"
    )
  );

  config.setRule(
    "pp-ocr",
    new StructRule<KeyConfig>(
      { cwd: "", config_name: "" },
      undefined,
      undefined,
      undefined,
      "https://copytranslator.github.io/guide/12.0.0.html#ocr-%E9%85%8D%E7%BD%AE-%E5%85%89%E5%AD%A6%E5%AD%97%E7%AC%A6%E8%AF%86%E5%88%AB"
    )
  );

  config.setRule(
    "baidu-domain",
    new StructRule<KeyConfig>(
      { appid: "", key: "", domain: "" },
      generalCheck,
      {
        appid: { uiType: "text" },
        key: { uiType: "text" },
        domain: { uiType: "select", options: domains },
      },
      undefined,
      "https://fanyi-api.baidu.com/doc/24"
    )
  );

  config.setRule(
    "caiyun",
    new StructRule<KeyConfig>(
      { token: "" },
      emptyOrAllCheck,
      undefined,
      "caiyunConfigNote",
      "https://docs.caiyunapp.com/lingocloud-api/"
    )
  );

  config.setRule(
    "google",
    new StructRule<KeyConfig>(
      { token: "", source: "lingva", mirror: "" },
      googleCheck,
      {
        token: { uiType: "text" },
        source: { uiType: "select", options: googleSourceOptions },
        mirror: { uiType: "text" },
      },
      "googlePrompt",
      "https://copytranslator.github.io/guide/questions.html#%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E9%80%80%E5%87%BA%E4%B8%AD%E5%9B%BD%E5%B8%82%E5%9C%BA%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88"
    )
  );

  config.setRule(
    "sogou",
    new StructRule<KeyConfig>(
      { pid: "", key: "" },
      generalCheck,
      undefined,
      undefined,
      "https://fanyi.sogou.com/api/doc"
    )
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
    new StructRule<KeyConfig>(
      { appKey: "", key: "" },
      generalCheck,
      undefined,
      undefined,
      "https://ai.youdao.com/new/product-fanyi-text.s"
    )
  );

  config.setRule(
    "stepfun",
    new StructRule<KeyConfig>(
      {
        prompt: "default",
        temperature: "0.3",
        maxTokens: "4000",
      },
      undefined,
      {
        prompt: { uiType: "text" },
        temperature: { uiType: "select", options: temperatureOptions },
        maxTokens: { uiType: "select", options: maxTokensOptions },
      },
      "stepfunConfigNote",
      "https://www.stepfun.com/"
    )
  );

  config.setRule(
    "keyan",
    new StructRule<KeyConfig>(
      {},
      undefined,
      undefined,
      "keyanConfigNote",
      "https://www.keyanyuedu.com/"
    )
  );

  config.setRule(
    "aliyun",
    new StructRule<KeyConfig>(
      { accessKeyId: "", accessKeySecret: "" },
      generalCheck,
      undefined,
      undefined,
      "https://www.aliyun.com/product/ai/alimt"
    )
  );

  config.setRule(
    "azure",
    new StructRule<any>(
      { subscriptionKey: "", region: "", free: false },
      undefined,
      {
        subscriptionKey: { uiType: "text" },
        region: { uiType: "text" },
        free: { uiType: "checkbox", label: "azureFree" },
      },
      undefined,
      "https://azure.microsoft.com/en-us/services/cognitive-services/translator/"
    )
  );

  config.setRule(
    "deepl",
    new StructRule<KeyConfig>(
      { auth_key: "" },
      generalCheck,
      undefined,
      undefined,
      "https://www.deepl.com/pro-api"
    )
  );

  config.setRule(
    "tencent",
    new StructRule<KeyConfig>(
      { secretId: "", secretKey: "" },
      generalCheck,
      undefined,
      undefined,
      "https://cloud.tencent.com/product/tmt"
    )
  );

  config.setRule(
    "tencentsmart",
    new StructRule<KeyConfig>(
      {},
      undefined,
      undefined,
      undefined,
      "https://transmart.qq.com/index"
    )
  );

  config.setRule(
    "yandex",
    new StructRule<KeyConfig>(
      {},
      undefined,
      undefined,
      undefined,
      "https://yandex.com/dev/translate/"
    )
  );

  config.setRule(
    "volc",
    new StructRule<KeyConfig>(
      { accessKeyId: "", accessKeySecret: "" },
      generalCheck,
      undefined,
      undefined,
      "https://www.volcengine.com/product/translate"
    )
  );

  config.setRule(
    "niu",
    new StructRule<KeyConfig>(
      {apikey: "",},
      generalCheck,
      undefined,
      undefined,
      "https://niutrans.com/dev-page?type=text"
    )
  );


  // 翻译器供应商配置（新架构）
  config.setRule(
    "translatorProviders",
    new TypeRule<any[]>([])
  );

  // 这个是动态生成的，不需要保存
  config.setRule(
    "customTranslators",
    new TypeRule<string[]>([]),
    false
  );

  return config;
}

export { initConfig, ConfigParser };
const config = initConfig();
export default config;
