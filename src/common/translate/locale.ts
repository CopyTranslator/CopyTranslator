import { Locale } from "@opentranslate/languages";
import en from "@opentranslate/languages/locales/en.json";
import zhCN from "@opentranslate/languages/locales/zh-CN.json";
import zhTW from "@opentranslate/languages/locales/zh-TW.json";
import { Language } from "@opentranslate/languages";
// import { getDefaultLocale } from "@/main/l10n";

export const languageLocales = new Map<Language, typeof en>([
  ["en", en],
  ["zh-CN", zhCN],
  ["zh-TW", zhTW],
]);

export function getLanguageLocales(lang: Language): Locale {
  let key = lang;
  // if (key === "auto") {
  //   key = getDefaultLocale();
  // }
  return languageLocales.get(key) || en;
}
export { Language };
