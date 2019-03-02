enum RuleName {
    autoCopy,
    listenClipboard,
    detectLanguage,
    incrementalCopy,
    stayTop,
    smartDict,
    autoHide,
    autoPaste,
    autoPurify,
    autoShow,
    frameMode,
    translatorType,
    // mode config
    focus,
    contrast,
    settingsConfig,
    //
    source,
    target,
    locale
}

let ruleKeys: Array<string> = Object.values(RuleName).filter(
    k => (typeof k as any) !== "number"
);

let reverseRuleName: any = {};
Object.values(RuleName)
    .filter(k => (typeof k as any) == "number")
    .forEach(e => {
        reverseRuleName[ruleKeys[e]] = e;
    });

interface ModeConfig {
    x: number;
    y: number;
    height: number;
    width: number;
    fontSize?: number;
}

type CheckFuction = (value: any) => boolean;

interface Rule {
    predefined: any;
    msg: string;
    check?: CheckFuction; // 检查是否有效的函数
}

class BoolRule implements Rule {
    predefined: boolean;
    msg: string;
    static check = function (value: any) {
        return typeof value == "boolean";
    };
    constructor(predefined: boolean, msg: string) {
        this.predefined = predefined;
        this.msg = msg;
    }
}

class NumberRule implements Rule {
    predefined: number;
    msg: string;
    check?: CheckFuction;

    constructor(predefined: number, msg: string, check?: CheckFuction) {
        this.predefined = predefined;
        this.msg = msg;
        if (check) {
            this.check = check;
        } else {
            this.check = function (value) {
                return typeof value == "number";
            }
        }
    }
}

class ModeRule implements Rule {
    predefined: ModeConfig;
    msg: string;
    check: CheckFuction;

    constructor(predefined: ModeConfig, msg: string) {
        this.predefined = predefined;
        this.msg = msg;
        this.check = function (value: any) {
            for (let key in predefined) {
                if (!value.hasOwnProperty(key) || (typeof value[key] !== typeof (<any>predefined)[key])) {
                    return false;
                }
            }
            return true;
        }
    }
}

export {
    Rule,
    NumberRule,
    ModeRule,
    BoolRule,
    CheckFuction,
    RuleName,
    reverseRuleName,
    ruleKeys,
    ModeConfig
};
