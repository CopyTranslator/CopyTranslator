const fs = require("fs");
const path = require("path");
const _ = require("lodash");
import { en, zh_cn, Locale } from "../tools/locales";
import { defaultShortcuts, Shortcuts } from "../tools/shortcuts";

type Resources = { [key: string]: Locale };

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
let resources: Resources = {
    'en': en,
    'zh-cn': zh_cn
};

fs.readdirSync(localeDir)
  .filter(
    (e: string) => !_.includes(Object.keys(resources), e.replace(".json", ""))
  )
  .forEach((fileName: string) => {
    const name = fileName.replace(".json", "");
    let locale = JSON.parse(fs.readFileSync(path.join(localeDir, fileName)));
    for (const key in en) {
      locale[key] = locale[key] ? locale[key] : (<any>en)[key];
    }
    resources[name] = locale;
  });

generateLocales(resources, localeDir);

generateShortcuts(shortcutPath, defaultShortcuts);
