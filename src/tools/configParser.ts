import { Rule, RuleName, ruleKeys } from "./rule";

var fs = require("fs");

type Rules = { [key: string]: Rule }; //类型别名
function getEnumValue(key: RuleName): string {
  return RuleName[key];
}

class ConfigParser {
  rules: Rules = {};
  values: { [key: string]: any } = {};
  defaultValues: { [key: string]: any } = {};

  constructor() {}

  addRule(key: RuleName, rule: Rule) {
    let keyValue = getEnumValue(key);
    if (rule.check && !rule.check(rule.predefined)) {
      throw "Rule " + keyValue + " is invald!";
    }
    this.rules[keyValue] = rule;
    this.values[keyValue] = rule.predefined;
    this.defaultValues[keyValue] = rule.predefined;
  }

  getValues() {
    return Object.assign({}, this.values);
  }

  get(key: RuleName) {
    return this.values[getEnumValue(key)];
  }

  set(key: RuleName, value: any) {
    let keyValue = getEnumValue(key);
    let check = this.rules[keyValue].check;
    if (check && !check(value)) {
      throw `${key} check fail`;
    } else {
      this.values[keyValue] = value;
    }
  }

  setByKeyValue(keyValue: string, value: any): boolean | undefined {
    if (!ruleKeys.includes(keyValue)) {
      return false;
    }
    let check = this.rules[keyValue].check;
    if (check && !check(value)) {
      return false;
    } else {
      if (typeof this.rules[keyValue].predefined == "object") {
        this.values[keyValue] = Object.assign(this.values[keyValue], value);
      } else {
        this.values[keyValue] = value;
      }
      return true;
    }
  }

  loadValues(fileName: string): boolean {
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      ruleKeys.forEach(keyValue => {
        if (values[keyValue] != undefined) {
          this.setByKeyValue(keyValue, values[keyValue]);
        }
      });
      this.saveValues(fileName);
      return true;
    } catch (e) {
      this.saveValues(fileName);
      return false;
    }
  }

  restoreDefault(fileName: string) {
    this.values = this.defaultValues;
    this.saveValues(fileName);
  }

  saveValues(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(this.values, null, 4));
  }
}

export { ConfigParser, getEnumValue };
