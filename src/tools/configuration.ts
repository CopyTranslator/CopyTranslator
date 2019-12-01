import { ConfigParser } from "./configParser";
import { GroupRule, StructRule, UnionRule, ModeConfig, TypeRule } from "./rule";
import { HideDirection, hideDirections } from "./enums";
import { languages, Language } from "@opentranslate/languages";
import { translatorTypes, TranslatorType } from "./translate/types";
import {
  Identifier,
  RouteActionType,
  routeActionTypes,
  identifiers
} from "./types";
function initConfig(
  config: ConfigParser | undefined = undefined
): ConfigParser {
  if (!config) config = new ConfigParser();

  config.setRule(
    "autoCopy",
    new TypeRule<boolean>(false, "auto copy result to clipboard")
  );

  config.setRule(
    "listenClipboard",
    new TypeRule<boolean>(true, "Listen to Clipboard")
  );
  config.setRule(
    "dragCopy",
    new TypeRule<boolean>(false, "catch simulate copy")
  );

  config.setRule(
    "incrementalCopy",
    new TypeRule<boolean>(false, "incremental copy")
  );
  config.setRule("stayTop", new TypeRule<boolean>(false, "always stay on top"));
  config.setRule("smartDict", new TypeRule<boolean>(true, "smart dict"));
  config.setRule(
    "smartTranslate",
    new TypeRule<boolean>(true, "smart translate")
  );

  config.setRule(
    "autoPaste",
    new TypeRule<boolean>(false, "auto paste after translate")
  );

  config.setRule(
    "autoHide",
    new TypeRule<boolean>(false, "auto hide when close to edge")
  );

  config.setRule(
    "autoFormat",
    new TypeRule<boolean>(false, "auto replace the contene in clipboard")
  );

  config.setRule(
    "autoPurify",
    new TypeRule<boolean>(true, "remove extra linebreak when translate")
  );

  config.setRule(
    "autoShow",
    new TypeRule<boolean>(false, "auto show after translate")
  );
  config.setRule(
    "enableNotify",
    new TypeRule<boolean>(false, "notify after translate")
  );
  config.setRule(
    "skipTaskbar",
    new TypeRule<boolean>(false, "hide the taskbar")
  );
  config.setRule("closeAsQuit", new TypeRule<boolean>(false, "close as quit"));

  config.setRule(
    "frameMode",
    new UnionRule<RouteActionType>(
      "contrast",
      "current frame mode",
      routeActionTypes
    )
  );

  config.setRule(
    "translatorType",
    new UnionRule<TranslatorType>(
      "google",
      "type of translator",
      translatorTypes
    )
  );

  config.setRule(
    "hideDirect",
    new UnionRule<HideDirection>("Up", "HideDirection", hideDirections)
  );

  config.setRule(
    "focus",
    new StructRule<ModeConfig>(
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

  config.setRule(
    "contrast",
    new StructRule<ModeConfig>(
      {
        x: 535,
        y: 186,
        height: 600,
        width: 1094,
        fontSize: 15
      },
      "parameters of contrast mode"
    )
  );

  config.setRule(
    "settings",
    new StructRule<ModeConfig>(
      {
        x: 1390,
        y: 133,
        height: 787,
        width: 362
      },
      "parameters of setting panel"
    )
  );

  config.setRule(
    "sourceLanguage",
    new UnionRule<Language>("en", "sourceLanguage language", languages)
  );

  config.setRule(
    "targetLanguage",
    new UnionRule<Language>("zh-CN", "targetLanguage language", languages)
  );

  config.setRule(
    "localeSetting",
    new UnionRule<Language>("zh-CN", "localeSetting setting", languages)
  );

  config.setRule(
    "contrastPanel",
    new GroupRule<Identifier>(
      [
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "focus",
        "settings",
        "exit"
      ],
      "the context menu of contrast mode",
      identifiers
    )
  );

  config.setRule(
    "focusRight",
    new GroupRule<Identifier>(
      [
        "retryTranslate",
        "autoCopy",
        "autoPaste",
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
      "the context menu of focus mode",
      identifiers
    )
  );

  config.setRule(
    "tray",
    new GroupRule<Identifier>(
      [
        "translatorType",
        "hideDirect",
        "copySource",
        "copyResult",
        "clear",
        "retryTranslate",
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "enableNotify",
        "contrast",
        "focus",
        "settings",
        "helpAndUpdate",
        "exit"
      ],
      "the menu of tray",
      identifiers
    )
  );

  config.setRule(
    "contrastPanel",
    new GroupRule<Identifier>(
      [
        "autoCopy",
        "autoPaste",
        "incrementalCopy",
        "autoHide",
        "autoShow",
        "autoFormat",
        "enableNotify",
        "dragCopy",
        "stayTop",
        "listenClipboard",
        "sourceLanguage",
        "targetLanguage"
      ],
      "the options of contrast mode",
      identifiers
    )
  );
  config.setRule("notices", {
    predefined: [""],
    msg: "id of notices that have been read"
  });

  config.setRule("APP_ID", new TypeRule<string>("", "APP_ID"));
  config.setRule("API_KEY", new TypeRule<string>("", "API_KEY"));
  config.setRule("SECRET_KEY", new TypeRule<string>("", "SECRET_KEY"));

  return config;
}

export { initConfig, ConfigParser };
