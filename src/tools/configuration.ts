import { ConfigParser } from "./configParser";
import {
  BoolRule,
  EnumRule,
  GroupRule,
  ModeRule,
  StringRule,
  RuleName
} from "./rule";
import { FrameMode, HideDirection } from "./enums";
import { TranslatorType } from "./translation/translators";
import { RouteName } from "./action";

function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.addRule(
    RuleName.autoCopy,
    new BoolRule(false, "auto copy result to clipboard")
  );

  config.addRule(
    RuleName.listenClipboard,
    new BoolRule(true, "Listen to Clipboard")
  );
  config.addRule(
    RuleName.detectLanguage,
    new BoolRule(false, "detect language")
  );
  config.addRule(RuleName.tapCopy, new BoolRule(false, "catch simulate copy"));

  config.addRule(
    RuleName.incrementalCopy,
    new BoolRule(false, "incremental copy")
  );
  config.addRule(RuleName.stayTop, new BoolRule(false, "always stay on top"));
  config.addRule(RuleName.smartDict, new BoolRule(true, "smart dict"));
  config.addRule(
    RuleName.smartTranslate,
    new BoolRule(true, "smart translate")
  );

  config.addRule(
    RuleName.autoPaste,
    new BoolRule(false, "auto paste after translate")
  );

  config.addRule(
    RuleName.autoHide,
    new BoolRule(false, "auto hide when close to edge")
  );

  config.addRule(
    RuleName.autoFormat,
    new BoolRule(false, "auto replace the contene in clipboard")
  );

  config.addRule(
    RuleName.autoPurify,
    new BoolRule(true, "remove extra linebreak when translate")
  );

  config.addRule(
    RuleName.autoShow,
    new BoolRule(false, "auto show after translate")
  );
  config.addRule(
    RuleName.enableNotify,
    new BoolRule(false, "notify after translate")
  );

  config.addRule(RuleName.frameMode, {
    predefined: RouteName.Contrast,
    msg: "current frame mode"
  });

  config.addRule(
    RuleName.translatorType,
    new EnumRule(TranslatorType.Google, "type of translator", TranslatorType)
  );

  config.addRule(
    RuleName.hideDirect,
    new EnumRule(HideDirection.Up, "HideDirection", HideDirection)
  );
  config.addRule(
    RuleName.focus,
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
    RuleName.contrast,
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
    RuleName.settingsConfig,
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

  config.addRule(RuleName.sourceLanguage, {
    predefined: "English",
    msg: "sourceLanguage language"
  });

  config.addRule(RuleName.targetLanguage, {
    predefined: "Chinese(Simplified)",
    msg: "targetLanguage language"
  });

  config.addRule(RuleName.localeSetting, {
    predefined: "zh-cn",
    msg: "localeSetting setting"
  });

  config.addRule(
    RuleName.contrastMenu,
    new GroupRule(
      [
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "autoPurify",
        "incrementalCopy",
        "autoFormat",
        "tapCopy",
        "stayTop",
        "focusMode",
        "settings",
        "exit"
      ],
      "the context menu of contrast mode"
    )
  );

  config.addRule(
    RuleName.focusMenu,
    new GroupRule(
      [
        "copySource",
        "copyResult",
        "clear",
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
        "tapCopy",
        "stayTop",
        "listenClipboard",
        "settings",
        "exit"
      ],
      "the context menu of focus mode"
    )
  );

  config.addRule(
    RuleName.trayMenu,
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
        "tapCopy",
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
    RuleName.contrastOption,
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
        "tapCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage"
      ],
      "the options of contrast mode"
    )
  );
  config.addRule(RuleName.notices, {
    predefined: [""],
    msg: "id of notices that have been read"
  });

  config.addRule(RuleName.APP_ID, new StringRule("", "APP_ID"));
  config.addRule(RuleName.API_KEY, new StringRule("", "API_KEY"));
  config.addRule(RuleName.SECRET_KEY, new StringRule("", "SECRET_KEY"));

  return config;
}

export { initConfig, ConfigParser };
