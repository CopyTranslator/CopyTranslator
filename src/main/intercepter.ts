import { BrowserWindow, BrowserView } from "electron";
import path from "path";
import { env, osType } from "../common/env";
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
  ["auto", "auto"],
  ["zh-CN", "zh-Hans"],
  ["en", "en"],
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
  ["pt", "pt"],
  ["ja", "ja"],
  ["sv", "sv"],
  ["sk", "sk"],
  ["sl", "sl"],
  ["es", "es"],
  ["el", "el"],
  ["hu", "hu"],
  ["it", "it"],
  ["en", "en"],
];
export interface BingConfig {}

interface BingSingleResult {
  detectedLanguage: { language: string; score: number };
  translations: { text: string }[];
  to: string;
}

// interface DeeplResult {
//   result: {
//     translations: {
//       beams: {
//         sentences: [
//           {
//             text: string;
//           }
//         ];
//         num_symbols: number;
//       }[];
//     }[];
//     target_lang: string;
//     source_lang: string;
//     source_lang_is_confident: boolean;
//     detectedLanguages: {};
//   };
// }

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

function commonSetup(content: BrowserView["webContents"]) {
  content.openDevTools();
  // 跨域处理
  content.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({
      requestHeaders: { Origin: "*", ...details.requestHeaders },
    });
  });
  content.session.webRequest.onHeadersReceived((details: any, callback) => {
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
    }
    callback({
      responseHeaders: {
        "Access-Control-Allow-Origin": ["*"],
        ...details.responseHeaders,
      },
    });
  });

  content.on("dom-ready", () => {
    const uaArr = content.getUserAgent().split(" ");
    const newUaArr = uaArr.filter((uar) => !uar.startsWith("Electron"));
    content.setUserAgent(newUaArr.join(" "));
  });
}
const DL_PREFIX = "<__COPYTRANSLATOR__>";
function deeplSetup(content: BrowserView["webContents"]) {
  content.openDevTools();
  // 跨域处理
  content.session.webRequest.onBeforeSendHeaders((details, callback) => {
    // console.log("requests", details.requestHeaders);
    callback({
      requestHeaders: { ...details.requestHeaders },
    });
  }); //simpleDebug
  content.session.webRequest.onHeadersReceived((details: any, callback) => {
    // console.log("response", details.responseHeaders);
    // if (details) {
    //   //https://blog.csdn.net/youyudexiaowangzi/article/details/120239241
    //   if (details.responseHeaders["X-Frame-Options"]) {
    //     delete details.responseHeaders["X-Frame-Options"];
    //   } else if (details.responseHeaders["x-frame-options"]) {
    //     delete details.responseHeaders["x-frame-options"];
    //   }
    //   if (details.responseHeaders["Content-Security-Policy"]) {
    //     delete details.responseHeaders["Content-Security-Policy"];
    //   } else if (details.responseHeaders["content-security-policy"]) {
    //     delete details.responseHeaders["content-security-policy"];
    //   }
    //   if (details.responseHeaders["access-control-allow-origin"]) {
    //     delete details.responseHeaders["access-control-allow-origin"];
    //   } //这一句
    //   if (details.responseHeaders["access-control-allow-methods"]) {
    //     delete details.responseHeaders["access-control-allow-methods"];
    //   } //这一句
    // }
    callback({
      responseHeaders: {
        // "Access-Control-Allow-Origin": ["*"],
        // "Access-Control-Allow-Methods": "POST, GET, PUT, OPTIONS, DELETE",
        ...details.responseHeaders,
      },
    });
  });

  content.on("dom-ready", () => {
    const uaArr = content.getUserAgent().split(" ");
    const newUaArr = uaArr.filter((uar) => !uar.startsWith("Electron"));
    content.setUserAgent(newUaArr.join(" "));
  });
}

export class Deepl extends Translator<BingConfig> {
  readonly name = "deepl";
  results: any;
  localBus = new EventEmitter();
  debug: boolean = true;

  private static readonly langMap = new Map(deeplLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Deepl.langMap.keys()];
  }

  content: BrowserWindow["webContents"];
  view = new BrowserView();
  constructor(init: TranslatorInit<BingConfig> = {}) {
    super(init);
    //这里是browser view
    if (this.debug) {
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
    }
    this.content = this.view.webContents;
    this.startService();
  }

  onResponse(raw_res: any) {
    this.results = raw_res;
    console.log("更新res", this.results);
    this.localBus.emit("unlocked");
  }

  startService() {
    deeplSetup(this.content);

    console.log("开始加载页面");
    this.content.loadURL("https://www.deepl.com/translator");
    console.log("过去加载");

    this.content.executeJavaScript(`
        var target = document.querySelector("#target-dummydiv");

        // Create an observer instance.
        var observer = new MutationObserver(function (mutations) {
          if (target.textContent.trim().length > 0) {
            const state = window._tState;
            const result = {
              targetText: state.targetText,
              sourceLang: state._sourceLang,
              targetLangSettings: state._targetLangSettings,
            };
            console.log("${DL_PREFIX}", JSON.stringify(result));
          }
        });
        
        // Pass in the target node, as well as the observer options.
        observer.observe(target, {
          // attributes: true, //simpleDebug
          childList: true, //内容发生变化
          // characterData: true,
        });
        const dom = document.querySelector(".lmt__source_textarea");
        function setInput(st) {
          var evt = new InputEvent("input", {
            inputType: "insertText",
            data: st,
            dataTransfer: null,
            isComposing: false,
          });
          dom.value = st;
          dom.dispatchEvent(evt);
        }
        function inputValue(base64Text) {
          console.log("inputValue");
          var st = window.atob(base64Text);
          setInput(""); //先重置一下，确保有结果的更新
          setInput(st);
        }
    
      `);
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
  }

  sendReq(text: string) {
    let buff = Buffer.from(text, "utf-8");
    let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    this.content.executeJavaScript(`
          inputValue(\`${base64data}\`);
      `);
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: BingConfig
  ): Promise<TranslateQueryResult> {
    this.sendReq(text);
    console.log("开始等待");
    await new Promise((resolve) => this.localBus.once("unlocked", resolve)); //等待结束
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
  debug: boolean = true;
  localBus = new EventEmitter();

  private static readonly langMap = new Map(bingLangMap);

  private static readonly langMapReverse = new Map(
    bingLangMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  getSupportLanguages(): Language[] {
    return [...Bing.langMap.keys()];
  }

  content: BrowserWindow["webContents"];
  view = new BrowserView();
  constructor(init: TranslatorInit<BingConfig> = {}) {
    super(init);
    //这里是browser view
    if (this.debug) {
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
    }

    this.content = this.view.webContents;
    this.startService();
  }

  onResponse(res: any) {
    this.results = res; //更新res
    this.localBus.emit("unlocked");
  }

  startService() {
    commonSetup(this.content);

    interceptResponse(this.content, "bing.com/ttranslatev3", (res) => {
      this.onResponse(res);
    });

    console.log("开始加载页面");
    this.content.loadURL("https://www.bing.com/translator");
    console.log("过去加载");

    this.content.executeJavaScript(`
        const dom = document.querySelector("#tta_input_ta");
        function inputValue(base64Text) {
            var st = window.atob(base64Text);
            var evt = new InputEvent("input", {
              inputType: "insertText",
              data: st,
              dataTransfer: null,
              isComposing: false,
            });
            dom.value = st;
            dom.dispatchEvent(evt);
            dom.click();
        } 
    `);
  }

  sendReq(text: string) {
    let buff = Buffer.from(text, "utf-8");
    let base64data = buff.toString("base64"); //这里因为是直接传，所以可能会存在一些问题，看看如果先加密再解密会不会好点
    this.content.executeJavaScript(`
        inputValue(\`${base64data}\`);
    `);
  }

  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: BingConfig
  ): Promise<TranslateQueryResult> {
    this.sendReq(text);
    console.log("开始等待");
    await new Promise((resolve) => this.localBus.once("unlocked", resolve)); //等待结束
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
