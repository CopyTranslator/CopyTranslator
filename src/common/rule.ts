import { Identifier, LayoutType } from "./types";

export const colorRules = new Map<Identifier, number>([
  ["autoCopy", 1],
  ["incrementalCopy", 2],
  ["autoPaste", 4],
]);

export function getColorRule(key: Identifier) {
  return <number>colorRules.get(key);
}
type CheckFuction = (value: any) => boolean;

interface ModeConfig {
  x: number;
  y: number;
  height: number;
  width: number;
  fontSize?: number;
}

export type LayoutConfig = {
  fontSize: number;
};

export type KeyConfig = { [key: string]: string };

interface Rule {
  predefined: any;
  tooltip: string;
  check?: CheckFuction; // 检查是否有效的函数
}

class GroupRule<T> implements Rule {
  predefined: Array<T>;
  tooltip: string;
  check: CheckFuction;
  constructor(predefined: Array<T>, msg: string, options: readonly T[]) {
    this.predefined = predefined;
    this.tooltip = msg;
    this.check = (value: Array<T>) => {
      value.forEach((item) => {
        if (!options.includes(item)) {
          return false;
        }
        return true;
      });
      return true;
    };
  }
}

export class UnionRule<T> implements Rule {
  predefined: any;
  tooltip: string;
  check: CheckFuction;
  constructor(predefined: T, msg: string, options: readonly T[]) {
    this.predefined = predefined;
    this.tooltip = msg;
    this.check = function (value: T) {
      return options.includes(value);
    };
  }
}
class TypeRule<T> implements Rule {
  predefined: T;
  tooltip: string;
  check?: CheckFuction;

  constructor(predefined: T, msg: string, check?: CheckFuction) {
    this.predefined = predefined;
    this.tooltip = msg;
    this.check = function (value) {
      let result: boolean = typeof value === typeof predefined;
      if (result && check) {
        result = result && check(value);
      }
      return result;
    };
  }
}
class StructRule<T extends { [key: string]: any }> implements Rule {
  predefined: T;
  tooltip: string;
  check: CheckFuction;
  constructor(predefined: T, msg: string) {
    this.predefined = predefined;
    this.tooltip = msg;
    this.check = function (value: T) {
      for (const key of Object.keys(predefined)) {
        if (
          value[key] == undefined ||
          typeof value[key] !== typeof predefined[key]
        ) {
          return false;
        }
      }
      return true;
    };
  }
}

export { Rule, TypeRule, StructRule, CheckFuction, ModeConfig, GroupRule };
