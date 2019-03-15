const md5 = require("md5");
const fetch = require("node-fetch");
import { sogou2code, code2sogou } from "./languages";
import {
  MyTranslateResult,
  handleNetWorkError,
  handleNoResult
} from "./translation";
const _ = require("lodash");

export interface SogouStorage {
  // sogou search token
  token: string;
  // token added date, update the token every day
  tokenDate: number;
}
export async function sogouTranslate(
  text: string,
  srcCode: string,
  tgtCode: string,
  dict_sogou: any = undefined
): Promise<MyTranslateResult> {
  srcCode = code2sogou(srcCode);
  tgtCode = code2sogou(tgtCode);
  if (
    dict_sogou == undefined ||
    Date.now() - dict_sogou.tokenDate > 24 * 3600 * 1000
  ) {
    dict_sogou = {
      token:
        (await getSogouToken().catch(() => "")) ||
        "b33bf8c58706155663d1ad5dba4192dc",
      tokenDate: Date.now()
    };
  }
  return fetch("https://fanyi.sogou.com/reventondc/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: `from=${srcCode}&to=${tgtCode}&text=${encodeURIComponent(
      text
    ).replace(/%20/g, "+")}&uuid=${getUUID()}&s=${md5(
      "" + srcCode + tgtCode + text + dict_sogou.token
    )}&client=pc&fr=browser_pc&useDetect=on&useDetectResult=on&needQc=1&oxford=on&isReturnSugg=on`
  })
    .then((r: any) => r.json())
    .catch(handleNetWorkError)
    .then((json: any) => handleJSON(json, srcCode, tgtCode))
    .catch(handleNetWorkError);
}

function handleJSON(
  json: any,
  sl: string,
  tl: string
): MyTranslateResult | Promise<MyTranslateResult> {
  const tr = json.translate as
    | undefined
    | {
        errorCode: string; // "0"
        from: string;
        to: string;
        text: string;
        dit: string;
      };
  if (!tr || tr.errorCode !== "0") {
    return handleNoResult();
  }
  return {
    text: tr.text,
    raw: undefined,
    link: "",
    from: sogou2code(sl),
    resultString: tr.dit,
    to: sogou2code(tl)
  };
}

function getUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += "-";
    }
    const digit = (16 * Math.random()) | 0;
    uuid += (i === 12 ? 4 : i === 16 ? (3 & digit) | 8 : digit).toString(16);
  }
  return uuid;
}

export async function getSogouToken(): Promise<string> {
  const homepage = await fetch("https://fanyi.sogou.com").then((r: any) =>
    r.text()
  );

  const appjsMatcher = /dlweb\.sogoucdn\.com\/translate\/pc\/static\/js\/app\.\S+\.js/;
  const appjsPath = (homepage.match(appjsMatcher) || [""])[0];
  if (!appjsPath) {
    return "";
  }
  const appjs = await fetch("https://" + appjsPath).then((r: any) => r.text());
  return (appjs.match(/"(\w{32})"/) || ["", ""])[1];
}
