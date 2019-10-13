import { ConfigParser } from "./configParser";
import { BoolRule, EnumRule, GroupRule, ModeRule, StringRule } from "./rule";
import { FrameMode, HideDirection } from "./enums";
import { RouteName } from "./action";

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.addRule(
    "autoCopy",
    new BoolRule(false, "auto copy result to clipboard")
  );

  config.addRule("listenClipboard", new BoolRule(true, "Listen to Clipboard"));
  config.addRule("detectLanguage", new BoolRule(false, "detect language"));
  config.addRule("dragCopy", new BoolRule(false, "catch simulate copy"));

  config.addRule("incrementalCopy", new BoolRule(false, "incremental copy"));
  config.addRule("stayTop", new BoolRule(false, "always stay on top"));
  config.addRule("smartDict", new BoolRule(true, "smart dict"));
  config.addRule("smartTranslate", new BoolRule(true, "smart translate"));

  config.addRule(
    "autoPaste",
    new BoolRule(false, "auto paste after translate")
  );

  config.addRule(
    "autoHide",
    new BoolRule(false, "auto hide when close to edge")
  );

  config.addRule(
    "autoFormat",
    new BoolRule(false, "auto replace the contene in clipboard")
  );

  config.addRule(
    "autoPurify",
    new BoolRule(true, "remove extra linebreak when translate")
  );

  config.addRule("autoShow", new BoolRule(false, "auto show after translate"));
  config.addRule("enableNotify", new BoolRule(false, "notify after translate"));

  config.addRule("skipTaskbar", new BoolRule(false, "hide the taskbar"));

  config.addRule("frameMode", {
    predefined: "Contrast",
    msg: "current frame mode"
  });

  config.addRule(
    "translatorType",
    new StringRule("Google", "type of translator")
  );

  config.addRule(
    "hideDirect",
    new EnumRule(HideDirection.Up, "HideDirection", HideDirection)
  );
  config.addRule(
    "focus",
    new ModeRule(
      {
        x: 1390,
        y: 133,
        height: 722,
        width: 229,
        fontSize: 33
      },
      "parameters of focus mode"
    )
  );

  config.addRule(
    "contrast",
    new ModeRule(
      {
        x: 535,
        y: 186,
        height: 585,
        width: 1094,
        fontSize: 15
      },
      "parameters of contrast mode"
    )
  );

  config.addRule(
    "settingsConfig",
    new ModeRule(
      {
        x: 1390,
        y: 133,
        height: 787,
        width: 362
      },
      "parameters of setting panel"
    )
  );

  config.addRule("sourceLanguage", {
    predefined: "en",
    msg: "sourceLanguage language"
  });

  config.addRule("targetLanguage", {
    predefined: "zh-CN",
    msg: "targetLanguage language"
  });

  config.addRule("localeSetting", {
    predefined: "zh-CN",
    msg: "localeSetting setting"
  });

  config.addRule(
    "contrastMenu",
    new GroupRule(
      [
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "autoPurify",
        "incrementalCopy",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "focusMode",
        "settings",
        "exit"
      ],
      "the context menu of contrast mode"
    )
  );

  config.addRule(
    "focusMenu",
    new GroupRule(
      [
        "contrastMode",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "autoPurify",
        "detectLanguage",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "settings",
        "exit"
      ],
      "the context menu of focus mode"
    )
  );

  config.addRule(
    "trayMenu",
    new GroupRule(
      [
        "translatorType",
        "hideDirect",
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "autoPurify",
        "detectLanguage",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "enableNotify",
        "contrastMode",
        "focusMode",
        "settings",
        "helpAndUpdate",
        "exit"
      ],
      "the menu of tray"
    )
  );

  config.addRule(
    "contrastOption",
    new GroupRule(
      [
        "autoCopy",
        "autoPaste",
        "detectLanguage",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoPurify",
        "autoFormat",
        "enableNotify",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage"
      ],
      "the options of contrast mode"
    )
  );
  config.addRule("notices", {
    predefined: [""],
    msg: "id of notices that have been read"
  });

  config.addRule("APP_ID", new StringRule("", "APP_ID"));
  config.addRule("API_KEY", new StringRule("", "API_KEY"));
  config.addRule("SECRET_KEY", new StringRule("", "SECRET_KEY"));

  return config;
}

export { initConfig, ConfigParser };
