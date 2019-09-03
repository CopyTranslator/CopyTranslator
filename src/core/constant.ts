const _ = require("lodash");
export const constants = {
  appName: "CopyTranslator",
  nickName: "Zouwu",
  version: "v8.5.0",
  stage: "alpha",
  wiki: "https://copytranslator.github.io/guide",
  homepage: "https://copytranslator.github.io",
  downloadPage:
    "https://copytranslator.github.io/guide/download.html#%E4%B8%8B%E8%BD%BD"
};
export const version = _.join(
  [constants.version, constants.nickName, constants.stage],
  " "
);
