import { Rule } from "./rule";
import { Identifier } from "./types";
import { compatible } from "./constant";
import store, { getConfigByKey, Config } from "../store";
type Rules = Map<Identifier, Rule>; //类型别名
import { readFileSync, writeFileSync } from "fs";
class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  file: string | undefined;

  constructor() {}

  config(): Config {
    return store.state.config;
  }

  keys() {
    return store.getters.keys;
  }

  setRule(key: Identifier, rule: Rule) {
    if (this.rules.has(key)) {
      throw `duplicate rule ${key}`;
    }
    this.rules.set(key, rule);
  }

  getRule(key: Identifier): Rule {
    return <Rule>this.rules.get(key);
  }

  get(key: Identifier) {
    return getConfigByKey(key);
  }

  set(key: Identifier, value: any, needCheck: boolean = true) {
    if (needCheck && !this.checkValid(key, value)) {
      return false;
    }
    const config = { [key]: value };
    store.dispatch("updateConfig", config);
    return true;
  }

  checkValid(key: Identifier, value: any): boolean {
    const check = this.getRule(key).check;
    if ((check && !check(value)) || value == undefined) {
      return false;
    }
    return true;
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).tooltip;
  }

  load(fileName: string): boolean {
    let status = true;
    try {
      const values = JSON.parse(readFileSync(fileName) as any);
      if (!values["version"] || !compatible(values["version"])) {
        throw "version incompatible, configs will be reset";
      }
      const config: Config = {};
      for (const key of this.rules.keys()) {
        let val = values[key];
        if (!this.checkValid(key, val)) {
          //无效的话，就置为默认值
          val = this.getRule(key).predefined;
        }
        config[key] = val;
      }
      store.dispatch("setConfig", config);
    } catch (e) {
      console.log(e);
      this.restoreDefault(fileName);

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
    writeFileSync(fileName, JSON.stringify(store.state.config, null, 4));
  }
}

export { ConfigParser };
