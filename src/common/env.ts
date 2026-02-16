import { homedir, type as osTypeFunc } from "os";
import { join, dirname } from "path";
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

// 检测便携模式：检查可执行文件所在目录是否存在 copytranslator 文件夹
function detectPortableMode(): boolean {
  try {
    const exeDir = dirname(process.execPath);
    const portableDir = join(exeDir, "copytranslator");
    
    // 检查目录是否存在且是文件夹
    if (existsSync(portableDir)) {
      try {
        const { statSync } = require("fs");
        const stat = statSync(portableDir);
        if (stat.isDirectory()) {
          return true;
        }
      } catch {
        // 无法获取 stat，假设是目录
        return true;
      }
    }
  } catch (error: any) {
    // 出错时忽略，使用默认路径
    console.log("Portable mode detection failed:", error.message);
  }
  return false;
}

const usePortable = detectPortableMode();

// 根据便携模式选择基础目录
const baseDir = usePortable
  ? join(dirname(process.execPath), "copytranslator")
  : join(homedir(), "copytranslator");

const sharedConfig: SharedConfig = {
  configDir: baseDir,
  userLocaleDir: join(baseDir, "locales"),
  configPath: join(baseDir, "copytranslator.json"),
  style: join(baseDir, "styles.css"),
  shortcut: join(baseDir, "shortcuts.json"),
  localShortcut: join(baseDir, "localShortcuts.json"),
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
