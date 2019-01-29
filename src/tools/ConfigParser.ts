import { Rule, RuleName } from "./rule";

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
  private setByKeyValue(keyValue: string, value: any) {
    let check = this.rules[keyValue].check;
    if (check && !check(value)) {
      throw `${keyValue} check fail`;
    } else {
      this.values[keyValue] = value;
    }
  }
  loadValues(fileName: string) {
    var values = JSON.parse(fs.readFileSync(fileName));
    for (let key in values) {
      this.setByKeyValue(key, values[key]);
    }
  }
  saveValues(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(this.values, null, 4));
  }
}

export { ConfigParser };
