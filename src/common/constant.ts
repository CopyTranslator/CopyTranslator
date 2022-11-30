export const constants = {
  appName: "CopyTranslator",
  nickName: "破晓",
  version: "10.3.0",
  stage: "stable",
  changelogs: "https://copytranslator.gitee.io/changelogs/v10.html",
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
    return false; //如果是测试版，肯定要更新的
  }
  try {
    const configInfos = configVersion
      .substring(1)
      .split(" ")[0]
      .split(".")
      .map((x) => parseInt(x));
    const currentInfos = version
      .substring(1)
      .split(" ")[0]
      .split(".")
      .map((x) => parseInt(x));
    const configCount =
      configInfos[0] * 10000 + configInfos[1] * 100 + configInfos[2];
    const currentCount =
      currentInfos[0] * 10000 + currentInfos[1] * 100 + currentInfos[2];
    if (configCount > currentCount) {
      return false; //回退到旧版本要把整个配置文件重置一下，避免冲突
    }
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

export function isLower(
  configVersion: string,
  minimalVersion: string
): boolean {
  if (configVersion.indexOf("beta") != -1) {
    return true; //如果是测试版，肯定要更新的
  }
  const configInfos = configVersion
    .substring(1)
    .split(" ")[0]
    .split(".")
    .map((x) => parseInt(x));
  const targetInfos = minimalVersion
    .substring(1)
    .split(" ")[0]
    .split(".")
    .map((x) => parseInt(x));
  const configCount =
    configInfos[0] * 10000 + configInfos[1] * 100 + configInfos[2];
  const targetCount =
    targetInfos[0] * 10000 + targetInfos[1] * 100 + targetInfos[2];
  return configCount < targetCount;
}
