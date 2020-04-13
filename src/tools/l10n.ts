const fs = require("fs");
const path = require("path");
import { env } from "./env";
import { Identifier, objToMap } from "./types";
import { en, Locale } from "./locales";
import { Language } from "@opentranslate/languages";
import { app } from "electron";

type Resouces = Map<Language, Locale>;

function getDefaultLocale(): Language {
  // let locale = app.getLocale();
  let locale = "zh";
  if (locale === "zh") {
    locale = "zh-CN";
  }
  if (["zh-CN", "en", "zh-TW"].indexOf(locale) == -1) {
    locale = "en";
  }
  return <Language>locale;
}

class L10N {
  resources: Resouces = new Map<Language, Locale>();
  locales: { lang: Language; localeName: string }[] = [];
  defaultLocale: Language = "auto";

  constructor(localeDirs: string[]) {
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        const filePath = path.join(localeDir, fileName);
        try {
          const locale = objToMap<string>(
            JSON.parse(fs.readFileSync(filePath))
          );
          const lang = fileName.replace(".json", "") as Language;
          this.resources.set(lang, locale);
          this.locales.push({
            lang,
            localeName: locale.get("localeName") as string
          });
        } catch (e) {
          console.log(`load ${filePath} fail`);
        }
      });
    });
  }

  getT(key: Language = "en") {
    if (key === "auto") {
      key = this.getDefaultLocale();
    }
    let locale: Locale = this.resources.get(key) || en;
    function T(key: Identifier): string {
      return locale.get(key) || <string>en.get(key);
    }
    return T;
  }

  getDefaultLocale() {
    if (this.defaultLocale === "auto") {
      this.defaultLocale = getDefaultLocale();
    }
    return this.defaultLocale;
  }
}

const localeDirs = [env.systemLocaleDir, env.userLocaleDir];
let l10n = new L10N(localeDirs);
export { l10n, L10N };
