const fs = require("fs");
const path = require("path");
import { en, zh_cn, Locale } from "./common/locales";
import { mapToObj, objToMap } from "./common/types";
import { Language } from "@opentranslate/languages";

const localeDir = path.join(process.cwd(), "dist_locales");

let resources = new Map<Language, Locale>([["en", en], ["zh-CN", zh_cn]]);

function mkdir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function generateLocales(resources: Map<Language, Locale>, localeDir: string) {
  mkdir(localeDir);
  for (let key of resources.keys()) {
    fs.writeFileSync(
      path.join(localeDir, key + ".json"),
      JSON.stringify(mapToObj(<Locale>resources.get(key)), null, 4)
    );
  }
}

const keys = Array.from(resources.keys());
fs.readdirSync(localeDir)
  .filter((e: string) => !keys.includes(<Language>e.replace(".json", "")))
  .forEach((fileName: string) => {
    const name = fileName.replace(".json", "");
    let locale = objToMap<string>(
      JSON.parse(fs.readFileSync(path.join(localeDir, fileName)))
    );
    for (const [key, value] of en) {
      locale.set(key, locale.get(key) || <string>value);
    }
    resources.set(<Language>name, locale);
  });

generateLocales(resources, localeDir);
