import { Rule, RuleName, ruleKeys, reverseRuleName } from "./rule";
var fs = require("fs");

type Rules = { [key: string]: Rule }; //类型别名

class ConfigParser {
  rules: Rules = {};
  values: { [key: string]: any } = {};
  constructor() {}
  addRule(key: RuleName, rule: Rule) {
    let keyValue = ConfigParser.getEnumValue(key);
    if (rule.check && !rule.check(rule.predefined)) {
      throw "Rule " + key + " is invald!";
    }
    this.rules[keyValue] = rule;
    this.values[keyValue] = rule.predefined;
  }

  static getEnumValue(key: RuleName): string {
    return RuleName[key];
  }

  getValues() {
    return Object.assign({}, this.values);
  }

  get(key: RuleName) {
    return this.values[ConfigParser.getEnumValue(key)];
  }

  set(key: RuleName, value: any) {
    let keyValue = ConfigParser.getEnumValue(key);
    let check = this.rules[keyValue].check;
    if (check && !check(value)) {
      throw `${key} check fail`;
    } else {
      this.values[keyValue] = value;
    }
  }
  setByKeyValue(keyValue: string, value: any): boolean {
    if (!reverseRuleName[keyValue]) {
      return false;
    }
    let check = this.rules[keyValue].check;
    if (check && !check(value)) {
      return false;
    } else {
      this.values[keyValue] = value;
      return true;
    }
  }

  loadValues(fileName: string): boolean {
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      ruleKeys.forEach(keyValue => {
        if (values[keyValue]) {
          this.setByKeyValue(keyValue, values[keyValue]);
        }
      });
      this.saveValues(fileName);
      return true;
    } catch (e) {
      (<any>global).log.debug(e);
      this.saveValues(fileName);
      return false;
    }
  }
  saveValues(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(this.values, null, 4));
  }
}

export { ConfigParser };
