const fs = require("fs");
const path = require("path");
import {envConfig} from "./envConfig";
import {en, Locale} from "./locales";

type Resource = { [key: string]: string };
type Resources = { [key: string]: Resource };

class L10N {
    resources: Resources;

    constructor(initValue: { resources: Resources }) {
        this.resources = initValue.resources;
    }

    getT(key: string = "en") {
        let locale:Locale=en;
        try {
            locale = JSON.parse(fs.readFileSync(this.resources[key]));
        } catch (e) {
            console.log(`load ${this.resources[key]} fail`);
        }
        function T(key: string) {
            if ((<any>locale)[key]) {
                return (<any>locale)[key];
            } else {
                return (<any>en)[key];
            }
        }

        return T;
    }

    getLocales() {
        let locales = [];
        for (let key in this.resources) {
            try {
                const locale = JSON.parse(fs.readFileSync(this.resources[key]));
                locales.push({short: key, localeName: locale.localeName});
            }catch (e) {
                console.log(`load ${this.resources[key]} fail`);
            }
        }
        return locales;
    }

    static loadLocales(localeDirs: Array<string>) {
        let resources: Resources = {};
        localeDirs.forEach((localeDir: string) => {
            fs.readdirSync(localeDir).forEach((fileName: string) => {
                resources[fileName.replace(".json", "")] = path.join(localeDir, fileName);
            });
        });
        return resources;
    }
}

let locales = L10N.loadLocales([
    envConfig.diffConfig.systemLocaleDir,
    envConfig.sharedConfig.userLocaleDir
]);
var l10n = new L10N({resources: locales});
export {l10n, L10N};
