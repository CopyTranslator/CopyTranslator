import { Rule } from "./rule";
import { Identifier } from "./types";
import { compatible, isLower, version } from "./constant";
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

  has(key: Identifier) {
    return this.rules.has(key);
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

  get<T>(key: Identifier): T {
    return getConfigByKey(key) as T;
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
      // console.log("schedule save pass");
    } else {
      const interval = 2000; //修改后预定一次保存，在此保存之前的所有修改都不会再预定保存
      this.lastSave = now + interval;
      setTimeout(() => {
        // console.log("schedule save");
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

  load(): boolean {
    let status = true;
    try {
      const values = JSON.parse(readFileSync(this.file) as any);
      if (!values["version"] || !compatible(values["version"])) {
        throw "version incompatible, configs will be reset"; //大版本冲突
      }
      if (isLower(values["version"], version)) {
        //升级到新版本的也认为是新用户
        values["isNewUser"] = true;
      }
      const config: Config = {};
      for (const key of this.rules.keys()) {
        let val = values[key];
        let isValid: boolean = true;
        const rule = this.getRule(key);
        if (
          rule.minimalVersion != undefined &&
          isLower(values["version"], rule.minimalVersion as string)
        ) {
          //config的版本小于这项rule的最低版本，则需要更新为最新的预定义值
          isValid = false;
        }
        isValid = isValid && this.checkValid(key, val);
        if (!isValid) {
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

  reset(key: Identifier) {
    const rule = this.rules.get(key);
    if (rule != undefined) {
      this.set(key, rule.predefined);
    } else {
      console.log(`Not rule named ${key}`);
    }
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
