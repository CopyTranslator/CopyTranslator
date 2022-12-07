import { BrowserWindow, BrowserView } from "electron";
import path from "path";
import { env, osType } from "../env";
import {
  Translator,
  Language,
  TranslateQueryResult,
  TranslatorInit,
} from "@opentranslate/translator";
const EventEmitter = require("events");
import fs from "fs";
import logger from "@/common/logger";

const TIMEOUT = 5000;
function runScript(content: BrowserView["webContents"], file: string) {
  const js = fs.readFileSync(path.join(env.externalResource, file)).toString();
  return content.executeJavaScript(js);
}

function interceptResponse(
  webContents: BrowserWindow["webContents"],
  subURL: string,
  callback: (value: any) => any
) {
  // 作者：被逼成全栈的码畜
  // 链接：https://juejin.cn/post/7081506118060474382
  // 来源：稀土掘金
  // 著作权归作者所有。
  // 商业转载请联系作者获得授权，非商业转载请注明出处。

  try {
    webContents.debugger.attach("1.1");
    console.log("Debugger attach success");
  } catch (err) {
    console.log("Debugger attach failed : ", err);
  }

  webContents.debugger.on("detach", (event, reason) => {
    console.log("Debugger detached due to : ", reason);
  });

  webContents.debugger.on("message", (event, method, params) => {
    if (method === "Network.responseReceived") {
      if (params.response.url.indexOf(subURL) != -1) {
        webContents.debugger
          .sendCommand("Network.getResponseBody", {
            requestId: params.requestId,
          })
          .then((response) => {
            return response.body;
          })
          .then(callback)
          .catch((e) => console.error(e));
      }
    }
  });
  webContents.debugger.sendCommand("Network.enable");
}
const bingLangMap: [Language, string][] = [
  ["auto", "auto-detect"],
  ["ar", "ar"],
  ["ga", "ga"],
  ["et", "et"],
  ["bg", "bg"],
  ["is", "is"],
  ["pl", "pl"],
  ["bs", "bs-Latn"],
  ["fa", "fa"],
  ["da", "da"],
  ["de", "de"],
  ["ru", "ru"],
  ["fr", "fr"],
  ["zh-TW", "zh-Hant"],
  ["fil", "fil"],
  ["fj", "fj"],
  ["fi", "fi"],
  ["gu", "gu"],
  ["kk", "kk"],
  ["ht", "ht"],
  ["ko", "ko"],
  ["nl", "nl"],
  ["ca", "ca"],
  ["zh-CN", "zh-Hans"],
  ["cs", "cs"],
  ["kn", "kn"],
  ["otq", "otq"],
  ["tlh", "tlh"],
  ["hr", "hr"],
  ["lv", "lv"],
  ["lt", "lt"],
  ["ro", "ro"],
  ["mg", "mg"],
  ["mt", "mt"],
  ["mr", "mr"],
  ["ml", "ml"],
  ["ms", "ms"],
  ["mi", "mi"],
  ["bn", "bn-BD"],
  ["hmn", "mww"],
  ["af", "af"],
  ["pa", "pa"],
  ["pt", "pt"],
  ["ps", "ps"],
  ["ja", "ja"],
  ["sv", "sv"],
  ["sm", "sm"],
  ["sr-Latn", "sr-Latn"],
  ["sr-Cyrl", "sr-Cyrl"],
  ["no", "nb"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["sw", "sw"],
  ["ty", "ty"],
  ["te", "te"],
  ["ta", "ta"],
  ["th", "th"],
  ["to", "to"],
  ["tr", "tr"],
  ["cy", "cy"],
  ["ur", "ur"],
  ["uk", "uk"],
  ["es", "es"],
  ["he", "iw"],
  ["el", "el"],
  ["hu", "hu"],
  ["it", "it"],
  ["hi", "hi"],
  ["id", "id"],
  ["en", "en"],
  ["yua", "yua"],
  ["yue", "yua"],
  ["vi", "vi"],
  ["ku", "ku"],
  // ["kmr", "kmr"],
  // ["or", "or"],
  // ["prs", "prs"],
];

const deeplLangMap: [Language, string][] = [
  ["auto", "auto"],
  ["bg", "bg"],
  ["et", "et"],
  ["pl", "pl"],
  ["da", "da"],
  ["de", "de"],
  ["ru", "ru"],
  ["fr", "fr"],
  ["fi", "fi"],
  ["nl", "nl"],
  ["zh-CN", "zh"],
  ["cs", "cs"],
  ["lv", "lv"],
  ["lt", "lt"],
  ["ro", "ro"],
  ["pt", "pt-PT"], //pt-BR
  ["ja", "ja"],
  ["sv", "sv"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["es", "es"],
  ["el", "el"],
  ["hu", "hu"],
  ["it", "it"],
  ["en", "en-US"], //en-GB
];

const tencentLangMap: [Language, string][] = [
  ["auto", "auto"],
  ["zh-CN", "zh"],
  ["en", "en"],
  ["ko", "kr"],
  ["ja", "jp"],
  ["de", "de"],
  ["fr", "fr"],
  ["es", "es"],
  ["it", "it"],
  ["tr", "tr"],
  ["ru", "ru"],
  ["pt", "pt"],
  ["vi", "vi"],
  ["id", "id"],
  ["ms", "ms"],
  ["th", "th"],
];

export interface IntercepterConfig {
  debug: boolean;
}
export interface BingConfig extends IntercepterConfig {}
export interface DeeplConfig extends IntercepterConfig {}

interface BingSingleResult {
  detectedLanguage: { language: string; score: number };
  translations: { text: string }[];
  to: string;
}

interface DeeplResult {
  targetText: string;
  sourceLang: string;
  targetLangSettings: { lang: string; variant: string };
}

interface TencentResult {
  from: string;
  to: string;
  targetText: string[];
}

const size = {
  width: 800,
  height: 600,
};

function clearUA(content: BrowserView["webContents"]) {
  content.on("dom-ready", () => {
    const uaArr = content.userAgent.split(" ");
    const newUaArr = uaArr.filter(
      (uar) => !(uar.startsWith("Electron") && uar.startsWith("copytranslator"))
    );
    content.userAgent = newUaArr.join(" ");
  });
}

function bingSetup(content: BrowserView["webContents"]) {
  // TODO 不知道为什么，这里也会拦截到deepl的请求
  // 跨域处理
  content.session.webRequest.onBeforeSendHeaders((details, callback) => {
    if (details.url.indexOf("deepl") != -1) {
      callback({
        requestHeaders: { ...details.requestHeaders },
      });
    } else {
      callback({
        requestHeaders: { Origin: "*", ...details.requestHeaders },
      });
    }
  });
  content.session.webRequest.onHeadersReceived((details: any, callback) => {
    if (details.url.indexOf("deepl") == -1) {
      if (details) {
        //https://blog.csdn.net/youyudexiaowangzi/article/details/120239241
        if (details.responseHeaders["X-Frame-Options"]) {
          delete details.responseHeaders["X-Frame-Options"];
        } else if (details.responseHeaders["x-frame-options"]) {
          delete details.responseHeaders["x-frame-options"];
        }
        if (details.responseHeaders["Content-Security-Policy"]) {
          delete details.responseHeaders["Content-Security-Policy"];
        } else if (details.responseHeaders["content-security-policy"]) {
          delete details.responseHeaders["content-security-policy"];
        }
        if (details.responseHeaders["access-control-allow-origin"]) {
          delete details.responseHeaders["access-control-allow-origin"];
        } //这一句
        if (details.responseHeaders["access-control-allow-credentials"]) {
          delete details.responseHeaders["access-control-allow-credentials"];
        } //这一句
      }
      callback({
        responseHeaders: {
          "Access-Control-Allow-Origin": ["*"],
          ...details.responseHeaders,
        },
      });
    } else {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
        },
      });
    }
  });
  clearUA(content);
}

const DL_PREFIX = "<__COPYTRANSLATOR__>";

function deeplSetup(content: BrowserView["webContents"]) {
  clearUA(content);
}

export abstract class InterceptTranslator<
  Config extends IntercepterConfig = { debug: false }
> extends Translator<Config> {
  abstract startService(): Promise<any>;
  localBus = new EventEmitter();
  content?: BrowserWindow["webContents"];
  view?: BrowserView;
  win?: BrowserWindow;
  serviceStarted: boolean = false;

  commonDebugStart() {
    if (this.config.debug) {
      //调试的时候可视化
      this.win = new BrowserWindow({
        width: 800,
        height: 600,
        // show: false,
        webPreferences: {
          // nodeIntegration: true,
          //   webSecurity: false,
        },
      });
      this.win.setBrowserView(this.view as BrowserView);
      (<BrowserView>this.view).setBounds({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
      });
      (<BrowserWindow["webContents"]>this.content).openDevTools();
    }
  }

  commonDebugShutdown() {
    if (this.config.debug && this.win != undefined) {
      this.win.destroy();
    }
  }

  destory(): void {
    if (this.view != undefined) {
      this.view.destroy();
      delete this.content;
      delete this.view;
    }
    this.content = undefined;
    this.view = undefined;
    this.commonDebugShutdown();
    this.serviceStarted = false;
  }

  restart(): Promise<any> {
    this.destory();
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(this.name);
      }, 10000); //Prevent infinitely waiting for the result.
      this.startService().then(() => {
        clearTimeout(timeoutId);
        console.log(this.name, "启动完成");
        resolve(0);
      });
    }).catch(() => {
      console.log(this.name, "启动失败");
    }); //等待结束
  }
}

export class Tencent extends InterceptTranslator<IntercepterConfig> {
  readonly name = "tencent";
  results: any;

  private static readonly langMap = new Map(tencentLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Tencent.langMap.keys()];
  }

  constructor(
    init: TranslatorInit<DeeplConfig> = { config: { debug: false } }
  ) {
    super(init);
  }

  onResponse(raw_res: any) {
    this.results = raw_res;
    this.localBus.emit("unlocked");
  }

  async startService() {
    this.view = new BrowserView();
    this.content = this.view.webContents;

    this.commonDebugStart();

    deeplSetup(this.content);

    this.content.on(
      "console-message",
      (event, level, message, line, sourceID) => {
        if (message.startsWith(DL_PREFIX)) {
          const result: TencentResult = JSON.parse(
            message.substring(DL_PREFIX.length + 1)
          );
          this.onResponse(result);
        }
      }
    );

    return this.content
      .loadURL("https://fanyi.qq.com/")
      .then(() =>
        runScript(this.content as BrowserWindow["webContents"], "tencent.js")
      )
      .then((res) => {
        this.serviceStarted = true;
        logger.toast("Tencent引擎已启动", true);
        return res;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  sendReq(from: string, to: string, text: string) {
    const idx = from.indexOf("-");
    if (idx != -1) {
      //from 没有变体的讲究，所以要把en-US变成en
      from = from.substring(0, idx);
    }
    let buff = Buffer.from(text, "utf-8");
    let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    (<BrowserView["webContents"]>this.content).executeJavaScript(`
          inputValue(\`${from}\`,\`${to}\`,\`${base64data}\`);
      `);
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: DeeplConfig
  ): Promise<TranslateQueryResult> {
    if (!this.serviceStarted) {
      throw "You need to first start the service";
    }
    this.sendReq(
      Tencent.langMap.get(from) as string,
      Tencent.langMap.get(to) as string,
      text
    );
    // console.log("开始等待", this.name);
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.restart();
        console.log(this.name, "翻译失败，已自动重启");
        reject({ status: 408, errorMsg: "Request timeout!" });
      }, TIMEOUT); //Prevent infinitely waiting for the result.
      this.localBus.once("unlocked", () => {
        clearTimeout(timeoutId);
        resolve(0);
      });
    }); //等待结束
    // console.log("结束等待", this.name);

    const tencentResult = this.results as TencentResult;
    const results = tencentResult.targetText;

    const detectedFrom =
      Tencent.langMapReverse.get(tencentResult.from.toLowerCase()) || "auto";

    return {
      text: text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: [text],
        tts: (await this.textToSpeech(text, detectedFrom)) as any,
      },
      trans: {
        paragraphs: results,
        tts: (await this.textToSpeech(results.join(" "), to)) as any,
      },
    };
  }
}

export class Deepl extends InterceptTranslator<DeeplConfig> {
  readonly name = "deepl";
  results: any;

  private static readonly langMap = new Map(deeplLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Deepl.langMap.keys()];
  }

  constructor(
    init: TranslatorInit<DeeplConfig> = { config: { debug: false } }
  ) {
    super(init);
  }

  onResponse(raw_res: any) {
    this.results = raw_res;
    // console.log(this.name, "更新res", this.results);
    this.localBus.emit("unlocked");
  }

  async startService() {
    this.view = new BrowserView();
    this.content = this.view.webContents;
    this.commonDebugStart();
    deeplSetup(this.content);
    this.content.on(
      "console-message",
      (event, level, message, line, sourceID) => {
        if (message.startsWith(DL_PREFIX)) {
          const result: DeeplResult = JSON.parse(
            message.substring(DL_PREFIX.length + 1)
          );
          this.onResponse(result);
        }
      }
    );
    return this.content
      .loadURL("https://www.deepl.com/translator")
      .then(() => {
        return runScript(
          this.content as BrowserWindow["webContents"],
          "deepl.js"
        );
      })
      .then((res) => {
        this.serviceStarted = true;
        logger.toast("Deepl引擎已启动", true);
        return res;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  sendReq(from: string, to: string, text: string) {
    const idx = from.indexOf("-");
    if (idx != -1) {
      //from 没有变体的讲究，所以要把en-US变成en
      from = from.substring(0, idx);
    }
    let buff = Buffer.from(text, "utf-8");
    let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    (<BrowserView["webContents"]>this.content).executeJavaScript(`
          inputValue(\`${from}\`,\`${to}\`,\`${base64data}\`);
      `);
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: DeeplConfig
  ): Promise<TranslateQueryResult> {
    if (!this.serviceStarted) {
      throw "You need to first start the service";
    }
    this.sendReq(
      Deepl.langMap.get(from) as string,
      Deepl.langMap.get(to) as string,
      text
    );
    // console.log("开始等待", this.name);
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.restart(); //自动重启
        console.log(this.name, "翻译失败，已自动重启");
        reject({ status: 408, errorMsg: "Request timeout!" });
      }, TIMEOUT * 2); //Prevent infinitely waiting for the result.
      this.localBus.once("unlocked", () => {
        clearTimeout(timeoutId);
        resolve(0);
      });
    }); //等待结束
    // console.log("结束等待", this.name);

    const deeplResult = this.results as DeeplResult;
    const results = [deeplResult.targetText];

    const detectedFrom =
      Deepl.langMapReverse.get(deeplResult.sourceLang.toLowerCase()) || "auto";

    return {
      text: text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: [text],
        tts: (await this.textToSpeech(text, detectedFrom)) as any,
      },
      trans: {
        paragraphs: results,
        tts: (await this.textToSpeech(results.join(" "), to)) as any,
      },
    };
  }
}

export class Bing extends InterceptTranslator<BingConfig> {
  readonly name = "bing";
  results: any;
  private static readonly langMap = new Map(bingLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Bing.langMap.keys()];
  }

  constructor(init: TranslatorInit<BingConfig> = { config: { debug: false } }) {
    super(init);
  }

  onResponse(res: any) {
    try {
      this.results = JSON.parse(res)[0]; //更新res
      this.localBus.emit("unlocked");
    } catch (e) {
      console.error(this.name, "res=", res);
      console.error(e);
    }
  }

  async startService() {
    this.view = new BrowserView();
    this.content = this.view.webContents;
    this.commonDebugStart();
    bingSetup(this.content);

    interceptResponse(this.content, "bing.com/ttranslatev3", (res) => {
      this.onResponse(res);
    });

    return this.content
      .loadURL("https://www.bing.com/translator")
      .then(() => {
        return runScript(
          this.content as BrowserWindow["webContents"],
          "bing.js"
        );
      })
      .then((res) => {
        this.serviceStarted = true;
        logger.toast("Bing引擎已启动", true);
        return res;
      })
      .catch((e) => {
        console.error(e);
      });
  }

  sendReq(from: string, to: string, text: string) {
    const buff = Buffer.from(text, "utf-8");
    const base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    (<BrowserView["webContents"]>this.content).executeJavaScript(`
        inputValue(\`${from}\`,\`${to}\`,\`${base64data}\`);
    `);
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: BingConfig
  ): Promise<TranslateQueryResult> {
    if (!this.serviceStarted) {
      throw "You need to first start the service";
    }
    this.sendReq(
      Bing.langMap.get(from) as string,
      Bing.langMap.get(to) as string,
      text
    );
    // console.log("开始等待", this.name);
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.restart(); //自动重启
        console.log(this.name, "翻译失败，已自动重启");
        reject({ status: 408, errorMsg: "Request timeout!" });
      }, TIMEOUT); //Prevent infinitely waiting for the result.
      this.localBus.once("unlocked", () => {
        clearTimeout(timeoutId);
        resolve(0);
      });
    }); //等待结束
    // console.log(this.name, "结束等待");
    // console.log(this.name, this.results);
    const bingRes: BingSingleResult = this.results;
    const results = [bingRes.translations[0].text];
    const detectedFrom =
      Bing.langMapReverse.get(bingRes.detectedLanguage.language) || "auto";
    return {
      text: text,
      from: detectedFrom,
      to,
      origin: {
        paragraphs: [text],
        tts: (await this.textToSpeech(text, detectedFrom)) as any,
      },
      trans: {
        paragraphs: results,
        tts: (await this.textToSpeech(results.join(" "), to)) as any,
      },
    };
  }
}
