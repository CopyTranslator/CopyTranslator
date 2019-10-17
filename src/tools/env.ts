const os = require("os");
const path = require("path");
const fs = require("fs");
const osType = os.type() as string;

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
  configDir: path.join(os.homedir(), "copytranslator"),
  userLocaleDir: path.join(os.homedir(), "copytranslator", "locales"),
  configPath: path.join(os.homedir(), "copytranslator", "copytranslator.json"),
  style: path.join(os.homedir(), "copytranslator", "styles.css"),
  shortcut: path.join(os.homedir(), "copytranslator", "shortcuts.json"),
  localShortcut: path.join(
    os.homedir(),
    "copytranslator",
    "localShortcuts.json"
  )
};

const diffConfig: DiffConfig =
  process.env.NODE_ENV == "production"
    ? {
        systemLocaleDir: path.join(process.resourcesPath, "locales"),
        executableDir: path.join(
          process.resourcesPath,
          currentSpec.executableDir
        ),
        iconPath: path.join(process.resourcesPath, currentSpec.iconName),
        trayIconPath: path.join(process.resourcesPath, trayName),
        styleTemplate: path.join(process.resourcesPath, "styles.css"),
        publicUrl: `file://${__dirname}`
      }
    : {
        systemLocaleDir: path.join(process.cwd(), "dist_locales"),
        executableDir: path.join(process.cwd(), currentSpec.executableDir),
        iconPath: path.join(process.cwd(), currentSpec.iconName),
        trayIconPath: path.join(process.cwd(), trayName),
        styleTemplate: path.join(process.cwd(), "src", "styles.css"),
        publicUrl: <string>process.env.WEBPACK_DEV_SERVER_URL
      };

const env: EnvConfig = { ...sharedConfig, ...diffConfig };

mkdir(env.configDir);
mkdir(env.userLocaleDir);

export { env };
