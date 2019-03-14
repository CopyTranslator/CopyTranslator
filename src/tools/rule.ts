import { en } from "./locales";
import { roles } from "./action";

enum RuleName {
  autoCopy,
  listenClipboard,
  detectLanguage,
  incrementalCopy,
  stayTop,
  smartDict,
  autoHide,
  autoPaste,
  autoFormat,
  autoShow,
  tapCopy,
  //enum rule
  frameMode,
  translatorType,
  hideDirect,
  // mode config
  focus,
  contrast,
  settingsConfig,
  //groups
  contrastMenu,
  focusMenu,
  trayMenu,
  contrastOption,
  //
  sourceLanguage,
  targetLanguage,
  localeSetting,
  notices
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

class GroupRule implements Rule {
  predefined: Array<string>;
  msg: string;
  static check = function(value: any) {
    if (!(value instanceof Array)) {
      return false;
    }
    const keys = Object.keys(en);
    for (let key in value) {
      if (
        !(value[key] in ruleKeys) &&
        !(value[key] in keys) &&
        !(value[key] in roles)
      ) {
        return false;
      }
    }
  };

  constructor(predefined: Array<string>, msg: string) {
    this.predefined = predefined;
    this.msg = msg;
  }
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
      this.check = function(value) {
        return typeof value == "number";
      };
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
    this.check = function(value: any) {
      for (let key in predefined) {
        if (
          !value.hasOwnProperty(key) ||
          typeof value[key] !== typeof (<any>predefined)[key]
        ) {
          return false;
        }
      }
      return true;
    };
  }
}

export class EnumRule implements Rule {
  predefined: any;
  msg: string;
  check: CheckFuction;

  constructor(predefined: any, msg: string, type: any) {
    this.predefined = predefined;
    this.msg = msg;
    this.check = function(value: any) {
      return (
        value in Object.values(type).filter(k => (typeof k as any) == "number")
      );
    };
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
  ModeConfig,
  GroupRule
};
