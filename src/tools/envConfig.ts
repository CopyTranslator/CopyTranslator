const os = require("os");
const path = require("path");
const fs = require("fs");

const iconName = os.type() == "Windows_NT" ? "icon.ico" : "icon.png";

const trayName = "tray@2x.png";

function mkdir(path: string) {
  if (fs.existsSync(path)) {
    return;
  } else {
    fs.mkdirSync(path);
  }
}

interface SharedConfig {
  userLocaleDir: string;
  configPath: string;
  configDir: string;
  style: string;
  shortcut: string;
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
  configDir: path.join(os.homedir(), "copytranslator"),
  userLocaleDir: path.join(os.homedir(), "copytranslator", "locales"),
  configPath: path.join(os.homedir(), "copytranslator", "copytranslator.json"),
  style: path.join(os.homedir(), "copytranslator", "styles.css"),
  shortcut: path.join(os.homedir(), "copytranslator", "shortcuts.json")
};

const diffConfig: DiffConfig =
  process.env.NODE_ENV == "production"
    ? {
        systemLocaleDir: path.join(process.resourcesPath, "locales"),
        iconPath: path.join(process.resourcesPath, iconName),
        trayIconPath: path.join(process.resourcesPath, trayName),
        styleTemplate: path.join(process.resourcesPath, "styles.css"),
        publicUrl: `file://${__dirname}`
      }
    : {
        systemLocaleDir: path.join(process.cwd(), "dist_locales"),
        iconPath: path.join(process.cwd(), iconName),
        trayIconPath: path.join(process.cwd(), trayName),
        styleTemplate: path.join(process.cwd(), "src", "styles.css"),
        publicUrl: <string>process.env.WEBPACK_DEV_SERVER_URL
      };

const envConfig: EnvConfig = Object.assign(sharedConfig, diffConfig);

mkdir(envConfig.configDir);
mkdir(envConfig.userLocaleDir);

export { envConfig };
export default iconName;
