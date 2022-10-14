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

function runScript(content: BrowserView["webContents"], file: string) {
  const js = fs.readFileSync(path.join(env.externalResource, file)).toString();
  content.executeJavaScript(js);
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
export interface BingConfig {
  debug: boolean;
}

export interface DeeplConfig {
  debug: boolean;
}

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

type BingResult = BingSingleResult[];
const size = {
  width: 800,
  height: 600,
};

function clearUA(content: BrowserView["webContents"]) {
  content.on("dom-ready", () => {
    const uaArr = content.getUserAgent().split(" ");
    const newUaArr = uaArr.filter(
      (uar) => !(uar.startsWith("Electron") && uar.startsWith("copytranslator"))
    );
    content.setUserAgent(newUaArr.join(" "));
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

export class Deepl extends Translator<DeeplConfig> {
  readonly name = "deepl";
  results: any;
  localBus = new EventEmitter();
  serviceStarted: boolean = false;

  private static readonly langMap = new Map(deeplLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Deepl.langMap.keys()];
  }

  content: BrowserWindow["webContents"];
  view = new BrowserView();
  constructor(
    init: TranslatorInit<DeeplConfig> = { config: { debug: false } }
  ) {
    super(init);
    this.content = this.view.webContents;
    //这里是browser view
    if (this.config.debug) {
      //调试的时候可视化
      const win = new BrowserWindow({
        width: 800,
        height: 600,
        // show: false,
        webPreferences: {
          // nodeIntegration: true,
          //   webSecurity: false,
        },
      });
      win.setBrowserView(this.view);
      this.view.setBounds({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
      });
      this.content.openDevTools();
    }
  }

  onResponse(raw_res: any) {
    this.results = raw_res;
    console.log("更新res", this.results);
    this.localBus.emit("unlocked");
  }

  async startService() {
    deeplSetup(this.content);

    console.log("开始加载页面");
    this.content.loadURL("https://www.deepl.com/translator");
    console.log("过去加载");

    runScript(this.content, "deepl.js");
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
    this.serviceStarted = true;
  }

  sendReq(from: string, to: string, text: string) {
    const idx = from.indexOf("-");
    if (idx != -1) {
      //from 没有变体的讲究，所以要把en-US变成en
      from = from.substring(0, idx);
    }
    console.log("deepl inside from", from);
    console.log("deepl inside to", to);
    let buff = Buffer.from(text, "utf-8");
    let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    this.content.executeJavaScript(`
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
    console.log("deepl from", from);
    console.log("deepl to", to);
    this.sendReq(
      Deepl.langMap.get(from) as string,
      Deepl.langMap.get(to) as string,
      text
    );
    console.log("开始等待");
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject({ status: 408, errorMsg: "Request timeout!" });
      }, 10000); //Prevent infinitely waiting for the result.
      this.localBus.once("unlocked", () => {
        clearTimeout(timeoutId);
        resolve(0);
      });
    }); //等待结束
    console.log("结束等待");

    const deeplResult = this.results as DeeplResult;
    const results = [deeplResult.targetText];
    console.log("翻译结果", results);

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

export class Bing extends Translator<BingConfig> {
  readonly name = "bing";
  results: any;
  localBus = new EventEmitter();
  serviceStarted: boolean = false;

  private static readonly langMap = new Map(bingLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Bing.langMap.keys()];
  }

  content: BrowserWindow["webContents"];
  view = new BrowserView();
  constructor(init: TranslatorInit<BingConfig> = { config: { debug: false } }) {
    super(init);
    this.content = this.view.webContents;
    //这里是browser view
    if (this.config.debug) {
      const win = new BrowserWindow({
        width: 800,
        height: 600,
        // show: false,
        webPreferences: {
          // nodeIntegration: true,
          //   webSecurity: false,
        },
      });
      win.setBrowserView(this.view);
      this.view.setBounds({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
      });
      this.content.openDevTools();
    }
  }

  onResponse(res: any) {
    this.results = res; //更新res
    this.localBus.emit("unlocked");
  }

  async startService() {
    bingSetup(this.content);

    interceptResponse(this.content, "bing.com/ttranslatev3", (res) => {
      this.onResponse(res);
    });

    console.log("开始加载页面");
    this.content.loadURL("https://www.bing.com/translator");
    console.log("过去加载");

    runScript(this.content, "bing.js");
    this.serviceStarted = true;
  }

  sendReq(from: string, to: string, text: string) {
    const buff = Buffer.from(text, "utf-8");
    const base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    this.content.executeJavaScript(`
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
    console.log("开始等待");
    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject({ status: 408, errorMsg: "Request timeout!" });
      }, 10000); //Prevent infinitely waiting for the result.
      this.localBus.once("unlocked", () => {
        clearTimeout(timeoutId);
        resolve(0);
      });
    }); //等待结束
    console.log("结束等待");
    const bingRes: BingSingleResult = JSON.parse(this.results)[0];
    const results = [bingRes.translations[0].text];
    console.log("翻译结果", results);
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
