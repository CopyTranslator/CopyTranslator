var fs = require("fs");
var path = require("path");
import { en, zh_cn, Locale } from "../tools/locales";

const localeDir = path.join(process.cwd(), "dist_locales");

function generateLocales(
  locales: { [key: string]: Locale },
  localeDir: string
) {
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir);
  }
  for (let key in locales) {
    fs.writeFileSync(
      path.join(localeDir, key + ".json"),
      JSON.stringify(locales[key], null, 4)
    );
  }
}

// prettier-ignore
generateLocales({
    "en": en,
    "zh-cn": zh_cn
}, localeDir);
