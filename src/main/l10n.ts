import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { env } from "../common/env";
import { Identifier, objToMap } from "../common/types";
import { en, Locale } from "../common/locales";
import { Language } from "@opentranslate/languages";
import { app } from "electron";

type Resouces = Map<Language, Locale>;

function getDefaultLocale(): Language {
  let locale = app.getLocale();
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
      readdirSync(localeDir).forEach((fileName: string) => {
        const filePath = join(localeDir, fileName);
        try {
          const locale = objToMap<string>(
            JSON.parse(readFileSync(filePath) as any)
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

  getT(key: Language = "en"): (key: Identifier) => string {
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
