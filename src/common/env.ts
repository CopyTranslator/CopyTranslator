import { homedir, type as osTypeFunc } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { nativeImage } from "electron";
const osType = osTypeFunc() as string;

const osSpec: {
  [key: string]: { iconName: string; trayName: string };
} = {
  Windows_NT: {
    iconName: "icon.ico",
    trayName: "icon.ico",
  },
  Darwin: {
    iconName: "icon.png",
    trayName: "tray@2x.png",
  },
  Linux: {
    iconName: "icon.png",
    trayName: "tray@2x.png",
  },
};

const currentSpec = osSpec[osType];

const trayName = currentSpec.trayName;

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
        systemLocaleDir: join(process.resourcesPath, "locales"),
        iconPath: join(process.resourcesPath, currentSpec.iconName),
        trayIconPath: join(process.resourcesPath, trayName),
        styleTemplate: join(process.resourcesPath, "styles.css"),
        publicUrl: `file://${__dirname}`,
      }
    : {
        systemLocaleDir: join(process.cwd(), "dist_locales"),
        iconPath: join(process.cwd(), currentSpec.iconName),
        trayIconPath: join(process.cwd(), trayName),
        styleTemplate: join(process.cwd(), "src", "styles.css"),
        publicUrl: <string>process.env.WEBPACK_DEV_SERVER_URL,
      };

const env: EnvConfig = { ...sharedConfig, ...diffConfig };

mkdir(env.configDir);
mkdir(env.userLocaleDir);
const icon = nativeImage.createFromPath(env.iconPath);

export { env, icon };
