import { homedir, type as osTypeFunc } from "os";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
const osType = osTypeFunc() as string;

const osSpec: { [key: string]: { executableDir: string; iconName: string } } = {
  Windows_NT: {
    executableDir: "exe",
    iconName: "icon.ico"
  },
  Darwin: { executableDir: "scripts", iconName: "icon.png" },
  Linux: { executableDir: "scripts", iconName: "icon.png" }
};

const currentSpec = osSpec[osType];

const trayName = "tray@2x.png";

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
  executableDir: string;
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
  localShortcut: join(homedir(), "copytranslator", "localShortcuts.json")
};

const diffConfig: DiffConfig =
  process.env.NODE_ENV == "production"
    ? {
        systemLocaleDir: join(process.resourcesPath, "locales"),
        executableDir: join(process.resourcesPath, currentSpec.executableDir),
        iconPath: join(process.resourcesPath, currentSpec.iconName),
        trayIconPath: join(process.resourcesPath, trayName),
        styleTemplate: join(process.resourcesPath, "styles.css"),
        publicUrl: `file://${__dirname}`
      }
    : {
        systemLocaleDir: join(process.cwd(), "dist_locales"),
        executableDir: join(process.cwd(), currentSpec.executableDir),
        iconPath: join(process.cwd(), currentSpec.iconName),
        trayIconPath: join(process.cwd(), trayName),
        styleTemplate: join(process.cwd(), "src", "styles.css"),
        publicUrl: <string>process.env.WEBPACK_DEV_SERVER_URL
      };

const env: EnvConfig = { ...sharedConfig, ...diffConfig };

mkdir(env.configDir);
mkdir(env.userLocaleDir);

export { env };
