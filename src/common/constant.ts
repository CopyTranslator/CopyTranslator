export const constants = {
  appName: "CopyTranslator",
  nickName: "破晓",
  version: "10.2.1",
  stage: "stable",
  wiki: "https://copytranslator.gitee.io/guide",
  homepage: "https://copytranslator.gitee.io",
  downloadPage: "https://copytranslator.gitee.io/guide/download.html",
};
export const versionString = [
  "v" + constants.version,
  constants.nickName,
  constants.stage,
].join(" ");

export const version = versionString;

export function compatible(configVersion: string): boolean {
  if (configVersion.indexOf("beta") != -1 && configVersion != version) {
    return false;
  }
  try {
    const configInfos = configVersion.substring(1).split(".");
    const currentInfos = version.substring(1).split(".");
    for (const i of [0]) {
      //v10之后都是兼容的
      if (currentInfos[i] !== configInfos[i]) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
}
