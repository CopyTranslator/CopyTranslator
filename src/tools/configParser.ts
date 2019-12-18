import { Rule } from "./rule";
import { Identifier, mapToObj } from "./types";
import { version } from "../core/constant";
import { resetLocalShortcuts, resetGlobalShortcuts } from "./action";
import { resetStyle } from "./style";
var fs = require("fs");

type Rules = Map<Identifier, Rule>; //类型别名

function resetAllConfig() {
  resetLocalShortcuts();
  resetGlobalShortcuts();
  resetStyle();
}

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  values: Map<Identifier, any> = new Map<Identifier, any>();

  constructor() {}

  setRule(key: Identifier, rule: Rule) {
    this.rules.set(key, rule);
    this.values.set(key, rule.predefined);
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
      return false;
    } else {
      this.values.set(key, value);
      return true;
    }
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).msg;
  }

  loadValues(fileName: string): boolean {
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      if (values.get("version") !== version) {
        throw "version incompatible, configs have been reset";
      }
      for (const key of this.rules.keys()) {
        if (values[key] != undefined) {
          this.set(key, values[key]);
        }
      }
      this.saveValues(fileName);
      return true;
    } catch (e) {
      resetAllConfig();
      this.saveValues(fileName);
      return false;
    }
  }

  restoreDefault(fileName: string) {
    for (const [key, rule] of this.rules) {
      this.set(key, rule.predefined);
    }
    this.saveValues(fileName);
  }

  saveValues(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(mapToObj(this.values), null, 4));
  }
}

export { ConfigParser };
