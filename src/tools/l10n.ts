var fs = require("fs");
var path = require("path");
type Resource = { [key: string]: string };
type Resources = { [key: string]: Resource };

class L10N {
  lng: string;
  resources: Resources;
  constructor(initValue: { lng: string; resources: Resources }) {
    this.lng = initValue.lng;
    this.resources = initValue.resources;
  }
  getT() {
    var locale: Resource = this.resources[this.lng];
    function T(key: string) {
      return locale[key];
    }
    return T;
  }
  static loadLocales(localeDirs: Array<string>) {
    let resources: Resources = {};
    localeDirs.forEach((localeDir: string) => {
      fs.readdirSync(localeDir).forEach((fileName: string) => {
        let resource = JSON.parse(
          fs.readFileSync(path.join(localeDir, fileName))
        );
        resources[localeDir.replace(".json", "")] = resource;
      });
    });
    return resources;
  }
}
