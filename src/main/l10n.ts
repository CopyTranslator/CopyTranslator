import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { env } from "../common/env";
import { mapToObj, Locale } from "../common/types";
import { en } from "../common/locales";
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
  store: any;

  constructor(localeDirs: string[]) {
    localeDirs.forEach((localeDir: string) => {
      readdirSync(localeDir).forEach((fileName: string) => {
        const filePath = join(localeDir, fileName);
        try {
          let locale: Locale = JSON.parse(readFileSync(filePath) as any);
          for (const key of en.keys()) {
            if (!locale[key]) {
              locale[key] = en.get(key) as string;
            }
          }
          const lang = fileName.replace(".json", "") as Language;
          this.resources.set(lang, locale);
          this.locales.push({
            lang,
            localeName: locale["localeName"]
          });
        } catch (e) {
          console.log(`load ${filePath} fail`);
        }
      });
    });
  }

  getT(key: Language = "en"): Locale {
    if (key === "auto") {
      key = this.getDefaultLocale();
    }
    let locale: Locale = this.resources.get(key) || mapToObj(en);
    return locale;
  }

  getDefaultLocale() {
    if (this.defaultLocale === "auto") {
      this.defaultLocale = getDefaultLocale();
    }
    return this.defaultLocale;
  }

  install(store: any, key: Language) {
    this.store = store;
    store.dispatch("updateLocales", this.locales);
    this.updateLocale(key);
  }

  updateLocale(key: Language) {
    this.store.dispatch("updateLocale", this.getT(key));
  }
}

const localeDirs = [env.systemLocaleDir, env.userLocaleDir];
let l10n = new L10N(localeDirs);
export { l10n, L10N };
