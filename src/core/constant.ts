const _ = require("lodash");
function getAttr(attr: string): any {
  return process.env["npm_package_" + attr];
}

export const constants: { [key: string]: any } = {
  appName: getAttr("name"),
  nickName: "Zouwu",
  version: `v${getAttr("version")}`,
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
