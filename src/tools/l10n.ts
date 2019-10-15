const fs = require("fs");
const path = require("path");
import { env } from "./env";
import { Identifier, objToMap } from "./identifier";
import { en, Locale } from "./locales";
import { Language } from "@opentranslate/languages";

type Resouces = Map<Language, Locale>;

class L10N {
  resources: Resouces = new Map<Language, Locale>();

  languages: Language[];
  constructor(localeDirs: string[]) {
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        const filePath = path.join(localeDir, fileName);
        try {
          const locale = objToMap<string>(
            JSON.parse(fs.readFileSync(filePath))
          );
          const lang = fileName.replace(".json", "");
          this.resources.set(<Language>lang, locale);
        } catch (e) {
          console.log(`load ${filePath} fail`);
        }
      });
    });
    this.languages = Array.from(this.resources.keys());
  }

  getT(key: Language = "en") {
    let locale: Locale = en;
    function T(key: Identifier): string {
      return locale.get(key) || <string>en.get(key);
    }
    return T;
  }
}

const localeDirs = [env.systemLocaleDir, env.userLocaleDir];
let l10n = new L10N(localeDirs);
export { l10n, L10N };
