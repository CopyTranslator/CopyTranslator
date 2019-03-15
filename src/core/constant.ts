const _ = require("lodash");
export const constants = {
  appName: "CopyTranslator",
  nickName: "Zouwu",
  version: "v0.0.8",
  stage: "Alpha8",
  wiki: "https://copytranslator.github.io/guide",
  homepage: "https://copytranslator.github.io",
  downloadPage:
    "https://copytranslator.github.io/guide/download.html#%E4%B8%8B%E8%BD%BD"
};
export const version = _.join(
  [constants.version, constants.nickName, constants.stage],
  " "
);
