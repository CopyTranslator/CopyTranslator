import { en } from "./locales";
import { roles, RouteName } from "./action";
import { Controller } from "../core/controller";
import { Identifier, identifiers } from "./identifier";
import keyBy from "lodash.keyby";
//前面三个是不能交换顺序的，会出问题

export const colorRules = new Map<Identifier, number>([
  ["autoCopy", 1],
  ["incrementalCopy", 2],
  ["autoPaste", 4]
]);
export function getColorRule(key: Identifier) {
  return <number>colorRules.get(key);
}

const ruleKeys = identifiers;

interface ModeConfig {
  x: number;
  y: number;
  height: number;
  width: number;
  fontSize?: number;
}

class GroupRule implements Rule {
  predefined: Array<Identifier>;
  msg: string;
  constructor(predefined: Array<Identifier>, msg: string) {
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

class StringRule implements Rule {
  predefined: string;
  msg: string;
  constructor(predefined: string, msg: string) {
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

class ModeRule<T> implements Rule {
  predefined: T;
  msg: string;
  check: CheckFuction;

  constructor(predefined: T, msg: string) {
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

export class OptionRule implements Rule {
  predefined: any;
  msg: string;
  check: CheckFuction;
  constructor(predefined: any, msg: string, options: readonly any[]) {
    this.predefined = predefined;
    this.msg = msg;
    this.check = function(value: any) {
      return options.includes(value);
    };
  }
}

export class UnionRule<T> implements Rule {
  predefined: any;
  msg: string;
  check: CheckFuction;
  constructor(predefined: T, msg: string, options: readonly any[]) {
    this.predefined = predefined;
    this.msg = msg;
    this.check = function(value: T) {
      return options.includes(value);
    };
  }
}

export {
  Rule,
  NumberRule,
  ModeRule,
  BoolRule,
  CheckFuction,
  ruleKeys,
  ModeConfig,
  GroupRule,
  StringRule
};
