import { Rule, ruleKeys } from "./rule";
import { Identifier } from "./identifier";
var fs = require("fs");

type Rules = Map<Identifier, Rule>; //类型别名

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  values: Map<Identifier, any> = new Map<Identifier, any>();
  defaultValues: Map<Identifier, any> = new Map<Identifier, any>();

  constructor() {}

  addRule(key: Identifier, rule: Rule) {
    this.rules.set(key, rule);
    this.values.set(key, rule.predefined);
    this.defaultValues.set(key, rule.predefined);
  }

  getRule(key: Identifier): Rule {
    return <Rule>this.rules.get(key);
  }

  get(key: Identifier) {
    return this.values.get(key);
  }

  set(key: Identifier, value: any) {
    let check = this.getRule(key).check;
    if (check && !check(value)) {
      throw `${key} check fail`;
    } else {
      this.values.set(key, value);
    }
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).msg;
  }

  loadValues(fileName: string): boolean {
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      ruleKeys.forEach(key => {
        if (values[key] != undefined) {
          this.set(key, values[key]);
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

export { ConfigParser };
