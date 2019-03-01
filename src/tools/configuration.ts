import {ConfigParser} from "./configParser";
import {BoolRule, ModeRule, NumberRule, RuleName} from "./rule";
import {TranslatorType, FrameMode} from "./enums";
import {autoUpdater} from "electron";

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
        new BoolRule(true, "detect language")
    );
    config.addRule(
        RuleName.incrementalCopy,
        new BoolRule(false, "incremental copy")
    );
    config.addRule(RuleName.stayTop, new BoolRule(false, "always stay on top"));
    config.addRule(RuleName.smartDict, new BoolRule(true, "smart dict"));

    config.addRule(
        RuleName.autoPaste,
        new BoolRule(false, "auto paste after translate")
    );

    config.addRule(
        RuleName.autoHide,
        new BoolRule(false, "auto hide when close to edge")
    );

    config.addRule(
        RuleName.autoPurify,
        new BoolRule(false, "auto replace the contene in clipboard")
    );

    config.addRule(
        RuleName.autoShow,
        new BoolRule(false, "auto show after translate")
    );

    config.addRule(RuleName.frameMode, {
        predefined: FrameMode.Contrast,
        msg: "current frame mode",
        check: (value: FrameMode) => {
            return !!FrameMode[value];
        }
    });

    config.addRule(RuleName.translatorType, {
        predefined: TranslatorType.Google,
        msg: "parameters of contrast mode",
        check: (value: TranslatorType) => {
            return !!TranslatorType[value];
        }
    });

    config.addRule(
        RuleName.focus,
        new ModeRule(
            {
                x: 100,
                y: 200,
                height: 200,
                width: 300,
                fontSize: 15
            },
            "parameters of focus mode"
        )
    );

    config.addRule(
        RuleName.contrast,
        new ModeRule(
            {
                x: 300,
                y: 500,
                height: 600,
                width: 800,
                fontSize: 15
            },
            "parameters of contrast mode",
            (value: any) => {
                return true;
            }
        )
    );

    config.addRule(RuleName.source, {
        predefined: "English",
        msg: "source language"
    });

    config.addRule(RuleName.target, {
        predefined: "Chinese(Simplified)",
        msg: "target language"
    });

    config.addRule(RuleName.locale, {
        predefined: "en",
        msg: "locale setting"
    });

    return config;
}

export {initConfig, ConfigParser};
