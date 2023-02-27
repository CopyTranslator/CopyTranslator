import { osSpec } from "./env";
let constants: { [key: string]: string } = {
  appName: "CopyTranslator",
  nickName: "破晓",
  version: "11.0.2",
  stage: "stable",
  changelogs: "https://copytranslator.gitee.io/changelogs/v10.html",
  wiki: "https://copytranslator.gitee.io/guide",
  homepage: "https://copytranslator.gitee.io",
  downloadPage: "https://copytranslator.gitee.io/guide/download.html",
  allChangelogs: "https://copytranslator.gitee.io/metadata",
  latest: `https://copytranslator.gitee.io/metadata/${osSpec.name}.json`,
  manualDownloadLink: `https://copytranslator.gitee.io/download/${osSpec.name}.html`,
};
constants[
  "currentChangelog"
] = `${constants.allChangelogs}/${constants.version}.md`;
const debug = false;
if (debug && process.env.NODE_ENV !== "production") {
  for (const key of Object.keys(constants)) {
    constants[key] = constants[key].replace(
      "https://copytranslator.gitee.io",
      "http://localhost:8080"
    );
  }
}

export function getChangelogURL(
  targetVersion: string = `v${constants.version}`
) {
  return `${constants.allChangelogs}/${targetVersion.substring(1)}.md`;
}

const terms = ["v" + constants.version, constants.nickName];
if (constants.stage != "stable") {
  terms.push(constants.stage);
}
export const version = terms.join(" ");

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
    if (configInfos[0] < 10) {
      return false;
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
  if (configVersion.indexOf("beta") != -1 && configVersion != version) {
    return true; //如果是测试版，且版本不一致，则肯定要更新的
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
export { constants };
