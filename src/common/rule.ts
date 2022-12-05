import { Identifier } from "./types";

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
  x: number;
  y: number;
  height: number;
  width: number;
  sourceFontSize?: number;
  resultFontSize: number;
  diffFontSize: number;
  dictFontSize: number;
  ratio?: number;
};

export type KeyConfig = { [key: string]: string };

export type ColorConfig = {
  light: string;
  dark: string;
};

interface Rule {
  predefined: any;
  check?: CheckFuction; // 检查是否有效的函数
  minimalVersion?: string;
  needSave?: boolean;
}

export class ColorRule implements Rule {
  predefined: ColorConfig;
  check?: CheckFuction;
  constructor(predefined: ColorConfig) {
    this.predefined = predefined;
    this.check = function (value: ColorConfig) {
      let valid: boolean = typeof value === typeof predefined;
      if (!valid) {
        return false;
      }
      for (const key of Object.keys(predefined)) {
        const val = value[key as keyof ColorConfig];
        valid = valid && !!val && val.startsWith("#");
      }
      return valid;
    };
  }
}

class GroupRule<T> implements Rule {
  predefined: Array<T>;
  check: CheckFuction;
  minimalVersion?: string;
  constructor(
    predefined: Array<T>,
    options: readonly T[],
    minimalVersion?: string
  ) {
    this.predefined = predefined;
    this.minimalVersion = minimalVersion;
    this.check = (value: Array<T>) => {
      if (!value.map((item) => options.includes(item)).includes(false)) {
        return true;
      } else {
        for (const item of value) {
          if (!options.includes(item)) {
            console.log("check fail, invalid item", item);
          }
        }
        return false;
      }
    };
  }
}

// class CustomGroupRule<T> implements Rule {
//   predefined: Array<T>;
//   check: CheckFuction;
//   minimalVersion?: string;
//   constructor(
//     predefined: Array<T>,
//     check: CheckFuction,
//     minimalVersion?: string
//   ) {
//     this.predefined = predefined;
//     this.minimalVersion = minimalVersion;
//     this.check = check;
//   }
// }

class ConstantGroupRule<T> implements Rule {
  predefined: Array<T>;
  check: CheckFuction;
  constructor(predefined: Array<T>, options: readonly T[]) {
    this.predefined = predefined;
    this.check = (value: Array<T>) => {
      return false;
    };
  }
}

export class UnionRule<T> implements Rule {
  predefined: any;
  check: CheckFuction;
  minimalVersion?: string;
  constructor(predefined: T, options: readonly T[], minimalVersion?: string) {
    this.predefined = predefined;
    this.minimalVersion = minimalVersion;
    this.check = function (value: T) {
      return options.includes(value);
    };
  }
}

class TypeRule<T> implements Rule {
  predefined: T;
  check?: CheckFuction;
  constructor(predefined: T, check?: CheckFuction) {
    this.predefined = predefined;
    this.check = function (value) {
      let result: boolean = typeof value === typeof predefined;
      if (check != undefined) {
        result = result && check(value);
      }
      return result;
    };
  }
}

class StructRule<T extends { [key: string]: any }> implements Rule {
  predefined: T;
  check: CheckFuction;
  constructor(predefined: T) {
    this.predefined = predefined;
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

export {
  Rule,
  TypeRule,
  StructRule,
  CheckFuction,
  ModeConfig,
  GroupRule,
  ConstantGroupRule,
};
