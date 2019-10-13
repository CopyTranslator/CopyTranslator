const fs = require("fs");
const path = require("path");
import { envConfig } from "./envConfig";
import { Identifier, objToMap } from "./identifier";
import { en, Locale } from "./locales";
type Resouces = { [string: string]: string };

class L10N {
  resources: Resouces;

  constructor(initValue: { resources: Resouces }) {
    this.resources = initValue.resources;
  }

  getT(key: string = "en") {
    let locale: Locale = en;
    try {
      locale = objToMap(JSON.parse(fs.readFileSync(this.resources[key])));
    } catch (e) {
      console.log(`load locale ${this.resources[key]} fail`);
    }
    function T(key: Identifier): string {
      return locale.get(key) || <string>en.get(key);
    }
    return T;
  }

  getLocales() {
    let locales = [];
    for (let key in this.resources) {
      try {
        const locale: { [key: string]: string } = JSON.parse(
          fs.readFileSync(this.resources[key])
        );
        locales.push({ short: key, localeName: locale.localeName });
      } catch (e) {
        console.log(`load ${this.resources[key]} fail`);
      }
    }
    return locales;
  }

  static loadLocales(localeDirs: Array<string>) {
    let resources: Resouces = {};
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        resources[fileName.replace(".json", "")] = path.join(
          localeDir,
          fileName
        );
      });
    });
    return resources;
  }
}

let locales = L10N.loadLocales([
  envConfig.systemLocaleDir,
  envConfig.userLocaleDir
]);
let l10n = new L10N({ resources: locales });
export { l10n, L10N };
