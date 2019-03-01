var fs = require("fs");
var path = require("path");
import {en, zh_cn, Locale} from "../tools/locales";
import {envConfig} from "../tools/envConfig";
import {defaultShortcuts, Shortcuts} from "../tools/shortcuts";

const localeDir = path.join(process.cwd(), "dist_locales");
const shortcutPath = path.join(process.cwd(), "src", "shortcuts.json");

function mkdir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function generateLocales(
    locales: { [key: string]: Locale },
    localeDir: string
) {
    mkdir(localeDir);
    for (let key in locales) {
        fs.writeFileSync(
            path.join(localeDir, key + ".json"),
            JSON.stringify(locales[key], null, 4)
        );
    }
}

function generateShortcuts(filename: string, shortcuts: Shortcuts) {
    fs.writeFileSync(filename, JSON.stringify(shortcuts, null, 4));
}

// prettier-ignore
generateLocales({
    "en": en,
    "zh-cn": zh_cn
}, localeDir);

generateShortcuts(shortcutPath, defaultShortcuts);
