var fs = require("fs");
var path = require("path");
import { envConfig } from "./envConfig";
import { en, Locale } from "./locales";

type Resource = { [key: string]: string };
type Resources = { [key: string]: Resource };

class L10N {
  resources: Resources;

  constructor(initValue: { resources: Resources }) {
    this.resources = initValue.resources;
  }

  getT(key: string = "en") {
    var locale = this.resources[key];
    if (!locale) (<Locale>locale) = en;

    function T(key: string) {
      if (locale[key]) return locale[key];
      else {
        return (<any>en)[key];
      }
    }

    return T;
  }

  getLocales() {
    let locales = [];
    for (let key in this.resources) {
      locales.push({ short: key, localeName: this.resources[key].localeName });
    }
    return locales;
  }

  static loadLocales(localeDirs: Array<string>) {
    let resources: Resources = {};
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        try {
          const filePath = path.join(localeDir, fileName);
          let resource = JSON.parse(fs.readFileSync(filePath));
          resources[fileName.replace(".json", "")] = resource;
        } catch (e) {
          (<any>global).log.debug("load error locales");
        }
      });
    });
    return resources;
  }
}

let locales = L10N.loadLocales([
  envConfig.diffConfig.systemLocaleDir,
  envConfig.sharedConfig.userLocaleDir
]);
var l10n = new L10N({ resources: locales });
export { l10n, L10N };
