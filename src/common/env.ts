import { homedir, type as osTypeFunc } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { nativeImage } from "electron";
const osType = osTypeFunc() as "Windows_NT" | "Darwin" | "Linux";

export const osSpec = {
  Windows_NT: {
    iconName: "icon.ico",
    trayName: "icon.ico",
    name: "windows",
  },
  Darwin: {
    iconName: "icon.png",
    trayName: "tray@2x.png",
    name: "mac",
  },
  Linux: {
    iconName: "icon.png",
    trayName: "tray@2x.png",
    name: "linux",
  },
}[osType];

const trayName = osSpec.trayName;

function mkdir(path: string) {
  if (existsSync(path)) {
    return;
  } else {
    mkdirSync(path);
  }
}

interface SharedConfig {
  userLocaleDir: string;
  configPath: string;
  configDir: string;
  style: string;
  shortcut: string;
  localShortcut: string;
}

interface DiffConfig {
  systemLocaleDir: string;
  externalResource: string;
  iconPath: string;
  trayIconPath: string;
  styleTemplate: string;
  publicUrl: string;
}

type EnvConfig = DiffConfig & SharedConfig;

const sharedConfig: SharedConfig = {
  configDir: join(homedir(), "copytranslator"),
  userLocaleDir: join(homedir(), "copytranslator", "locales"),
  configPath: join(homedir(), "copytranslator", "copytranslator.json"),
  style: join(homedir(), "copytranslator", "styles.css"),
  shortcut: join(homedir(), "copytranslator", "shortcuts.json"),
  localShortcut: join(homedir(), "copytranslator", "localShortcuts.json"),
};

const diffConfig: DiffConfig =
  process.env.NODE_ENV == "production"
    ? {
        externalResource: join(process.resourcesPath, "external_resource"),
        systemLocaleDir: join(process.resourcesPath, "locales"),
        iconPath: join(process.resourcesPath, osSpec.iconName),
        trayIconPath: join(process.resourcesPath, trayName),
        styleTemplate: join(process.resourcesPath, "styles.css"),
        publicUrl: `file://${__dirname}`,
      }
    : {
        externalResource: join(process.cwd(), "external_resource"),
        systemLocaleDir: join(process.cwd(), "dist_locales"),
        iconPath: join(process.cwd(), osSpec.iconName),
        trayIconPath: join(process.cwd(), trayName),
        styleTemplate: join(process.cwd(), "src", "styles.css"),
        publicUrl: <string>process.env.WEBPACK_DEV_SERVER_URL,
      };

const env: EnvConfig = { ...sharedConfig, ...diffConfig };

mkdir(env.configDir);
mkdir(env.userLocaleDir);
const icon = nativeImage.createFromPath(env.iconPath);

export { env, icon, osType };
