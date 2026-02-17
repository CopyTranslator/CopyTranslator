import { Identifier } from "./types";

export const colorRules = new Map<Identifier, number>([
  ["autoCopy", 1],
  ["incrementalCopy", 2],
  ["autoPaste", 4],
]);

export function getColorRule(key: Identifier) {
  return <number>colorRules.get(key);
}
export interface CheckResult {
  canSave: boolean;
  canEnable: boolean;
  saveReason?: string;
  enableReason?: string;
}

type CheckFuction = (value: any) => boolean | CheckResult;

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

// 字段UI元数据
export interface FieldMetadata {
  uiType: "text" | "select" | "textarea" | "number";
  options?: readonly string[];  // 下拉选项
  label?: string;               // i18n key
  description?: string;         // 提示文本
}

// 字段名到元数据的映射
export type FieldMetadataMap = {
  [fieldName: string]: FieldMetadata;
};

interface Rule {
  predefined: any;
  check?: CheckFuction; // 检查是否有效的函数
  minimalVersion?: string;
  needSave?: boolean;
  metadata?: FieldMetadataMap;  // 字段UI元数据（仅用于UI渲染，不持久化）
  notice?: string;
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

/**
 * FlexibleUnionRule 允许值为预定义选项之一，或任意字符串（用于自定义翻译器等扩展场景）
 */
export class FlexibleUnionRule<T> implements Rule {
  predefined: any;
  check: CheckFuction;
  minimalVersion?: string;
  constructor(predefined: T, options: readonly T[], minimalVersion?: string) {
    this.predefined = predefined;
    this.minimalVersion = minimalVersion;
    this.check = function (value: T | string) {
      // 接受预定义选项或任何字符串类型的值
      return options.includes(value as T) || typeof value === 'string';
    };
  }
}
// 类型检查规则, 必须和 predefined 类型相同
class TypeRule<T> implements Rule {
  predefined: T;
  check?: CheckFuction;
  constructor(predefined: T, check?: CheckFuction) {
    this.predefined = predefined;
    this.check = function (value) {
      let result: boolean = typeof value === typeof predefined;
      if (check != undefined) {
        const checkResult = check(value);
        const valid =
          typeof checkResult === "boolean" ? checkResult : checkResult.canSave;
        result = result && valid;
      }
      return result;
    };
  }
}
// 结构体规则, 必须和 predefined 类型相同, 且每个字段都必须存在
class StructRule<T extends { [key: string]: any }> implements Rule {
  predefined: T;
  check: CheckFuction;
  metadata?: FieldMetadataMap;
  notice?: string;
  constructor(
    predefined: T,
    check?: CheckFuction,
    metadata?: FieldMetadataMap,
    notice?: string
  ) {
    this.predefined = predefined;
    this.metadata = metadata;
    this.notice = notice;
    if (check) {
      this.check = check;
    } else {
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
