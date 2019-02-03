let os = require("os");
var path = require("path");
var fs = require("fs");

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
}

interface DiffConfig {
  systemLocaleDir: string;
}

interface EnvConfig {
  diffConfig: DiffConfig;
  sharedConfig: SharedConfig;
}

const sharedConfig: SharedConfig = {
  configDir: path.join(os.homedir(), "copytranslator"),
  userLocaleDir: path.join(os.homedir(), "copytranslator", "locales"),
  configPath: path.join(os.homedir(), "copytranslator", "copytranslator.json")
};

const ProductionConfig: DiffConfig = {
  systemLocaleDir: path.join(process.resourcesPath, "locales")
};

const DevConfig: DiffConfig = {
  systemLocaleDir: path.join(process.cwd(), "dist_locales")
};

const envConfig: EnvConfig = {
  sharedConfig: sharedConfig,
  diffConfig:
    process.env.NODE_ENV == "production" ? ProductionConfig : DevConfig
};

mkdir(envConfig.sharedConfig.configDir);
mkdir(envConfig.sharedConfig.userLocaleDir);

export { envConfig };
