import { Rule } from "./rule";
import { Identifier, mapToObj } from "./types";
const fs = require("fs");
import { compatible } from "../core/constant";
type Rules = Map<Identifier, Rule>; //类型别名
import { resetStyle } from "./style";
import { resetGlobalShortcuts, resetLocalShortcuts } from "./shortcuts";
import store from "../store";

export function resetAllConfig() {
  resetLocalShortcuts();
  resetGlobalShortcuts();
  resetStyle();
}

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  file: string | undefined;
  constructor() {}

  keys() {
    return store.getters.keys;
  }

  setRule(key: Identifier, rule: Rule) {
    this.rules.set(key, rule);
  }

  getRule(key: Identifier): Rule {
    return <Rule>this.rules.get(key);
  }

  get(key: Identifier) {
    return (store.state.config as any)[key];
  }

  set(key: Identifier, value: any) {
    let check = this.getRule(key).check;
    if (check && !check(value)) {
      return false;
    } else {
      let config = { [key]: value };
      store.dispatch("updateConfig", config);
      return true;
    }
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).msg;
  }

  load(fileName: string): boolean {
    let status = true;
    try {
      let values = JSON.parse(fs.readFileSync(fileName));
      if (!values["version"] || !compatible(values["version"])) {
        throw "version incompatible, configs have been reset";
      }
      for (const key of this.rules.keys()) {
        if (values[key] != undefined) {
          if (!this.set(key, values[key])) {
            //设置失败的话，就置为默认值
            this.set(key, this.getRule(key).predefined);
          }
        }
      }
    } catch (e) {
      resetAllConfig();
      status = false;
    }
    this.save(fileName);
    return status;
  }

  restoreDefault(fileName: string) {
    for (const [key, rule] of this.rules) {
      this.set(key, rule.predefined);
    }
    this.save(fileName);
  }

  save(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(store.state.config, null, 4));
  }
}

export { ConfigParser };
