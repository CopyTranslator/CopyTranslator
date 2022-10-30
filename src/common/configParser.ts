import { Rule } from "./rule";
import { Identifier } from "./types";
import { compatible } from "./constant";
import store, { getConfigByKey, Config } from "../store";
type Rules = Map<Identifier, Rule>; //类型别名
import { readFileSync, writeFileSync } from "fs";
import { env } from "../common/env";

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  file: string = env.configPath;
  lastSave = Date.now();

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
      console.log("invalid config value", key, value);
      return false;
    }
    const config = { [key]: value };
    store.dispatch("updateConfig", config);
    const now = Date.now();
    if (this.lastSave > now) {
      //就说明我们不需要唤起一次新的保存
      console.log("schedule save pass");
    } else {
      const interval = 2000; //修改后预定一次保存，在此保存之前的所有修改都不会再预定保存
      this.lastSave = now + interval;
      setTimeout(() => {
        console.log("schedule save");
        this.save();
      }, interval);
    }
    return true;
  }

  checkValid(key: Identifier, value: any): boolean {
    const check = this.getRule(key).check;
    if (value == undefined || (check != undefined && !check(value))) {
      return false;
    }
    return true;
  }

  getTooltip(key: Identifier) {
    return this.getRule(key).tooltip;
  }

  load(): boolean {
    let status = true;
    try {
      const values = JSON.parse(readFileSync(this.file) as any);
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
      this.restoreDefault();
      status = false;
    }
    this.save();
    return status;
  }

  restoreDefault() {
    for (const [key, rule] of this.rules) {
      this.set(key, rule.predefined);
    }
    this.save();
  }

  save() {
    writeFileSync(this.file, JSON.stringify(store.state.config, null, 4));
    const now = Date.now();
    if (now > this.lastSave) {
      this.lastSave = now;
    }
  }
}

export { ConfigParser };
