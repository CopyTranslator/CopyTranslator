var fs = require("fs");
var path = require("path");
import { envConfig } from "./envConfig";
type Resource = { [key: string]: string };
type Resources = { [key: string]: Resource };

class L10N {
  lng: string;
  resources: Resources;
  constructor(initValue: { lng: string; resources: Resources }) {
    this.lng = initValue.lng;
    this.resources = initValue.resources;
  }
  getT(lng: string = "en") {
    var locale: Resource = this.resources[lng];
    function T(key: string) {
      return locale[key];
    }
    return T;
  }
  static loadLocales(localeDirs: Array<string>) {
    let resources: Resources = {};
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        const filePath = path.join(localeDir, fileName);
        let resource = JSON.parse(fs.readFileSync(filePath));
        resources[fileName.replace(".json", "")] = resource;
      });
    });
    return resources;
  }
}

let locales = L10N.loadLocales([
  envConfig.diffConfig.systemLocaleDir,
  envConfig.sharedConfig.userLocaleDir
]);
var l10n = new L10N({ lng: "en", resources: locales });
export { l10n };
