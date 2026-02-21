import { Rule, CheckResult } from "./rule";
import { ConfigSnapshot, ConfigSnapshots, Identifier } from "./types";
import { compatible, isLower, version } from "./constant";
import store, { getConfigByKey, Config } from "../store";
import {
  hasTranslator,
  getEnabledWithCustomIds,
} from "./translate/translators";
type Rules = Map<Identifier, Rule>; //类型别名
import { readFileSync, writeFileSync } from "fs";
import { env } from "../common/env";
import bus from "./event-bus";

class ConfigParser {
  rules: Rules = new Map<Identifier, Rule>();
  file: string = env.configPath;
  lastSave = Date.now();
  notSavingKeys: Identifier[] = [];

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

  setRule(key: Identifier, rule: Rule, needSave: boolean = true) {
    if (this.rules.has(key)) {
      throw `duplicate rule ${key}`;
    }
    if (rule.check) {
      const status = this.normalizeCheckResult(rule.check(rule.predefined));
      if (!status.canSave) {
        console.log("invalid predefined", key, rule.predefined);
      }
    }
    rule.needSave = needSave;
    this.rules.set(key, rule);
    if (!needSave) {
      this.notSavingKeys.push(key);
    }
  }

  getRule(key: Identifier): Rule {
    return <Rule>this.rules.get(key);
  }

  get<T>(key: Identifier): T {
    return getConfigByKey(key) as T;
  }

  set(
    key: Identifier,
    value: any,
    needCheck: boolean = true,
    preSet: boolean = true
  ) {
    if (needCheck && !this.checkValid(key, value)) {
      console.log("invalid config value", key, value);
      return false;
    }
    if (preSet) {
      bus.gat("preSet", key, value);
    }
    const config = { [key]: value };
    store.dispatch("updateConfig", config);
    if (this.getRule(key).needSave) {
      //需要保存的才及时保存
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
    }
    return true;
  }

  checkValid(key: Identifier, value: any): boolean {
    if (value == undefined) {
      return false;
    }
    return this.checkStatus(key, value).canSave;
  }

  checkStatus(key: Identifier, value: any): CheckResult {
    if (value == undefined) {
      return {
        canSave: false,
        canEnable: false,
        saveReason: "配置为空",
        enableReason: "配置为空",
      };
    }
    const check = this.getRule(key).check;
    if (!check) {
      return { canSave: true, canEnable: true };
    }
    const status = this.normalizeCheckResult(check(value));
    if (!status.canSave && !status.saveReason) {
      status.saveReason = "配置未通过校验";
    }
    if (!status.canEnable && !status.enableReason) {
      status.enableReason = "配置未通过校验";
    }
    return status;
  }

  private normalizeCheckResult(result: boolean | CheckResult): CheckResult {
    if (typeof result === "boolean") {
      if (result) {
        return { canSave: true, canEnable: true };
      }
      return { canSave: false, canEnable: false };
    }
    return result;
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
      this.loadFromConfig(values);
    } catch (e) {
      console.log(e);
      this.restoreDefault();
      status = false;
    }
    this.save();
    return status;
  }

  loadFromConfig(values: Config) {
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
    const providerConfigs = (values["translatorProviders"] || []) as any[];
    const customIdsFromProviders = providerConfigs.flatMap((provider) => {
      const providerId = provider && provider.id;
      const enabledModels =
        (provider && provider.enabledModels) || [];
      if (!providerId || !Array.isArray(enabledModels)) {
        return [];
      }
      return enabledModels.map((model: string) => `${providerId}-${model}`);
    });
    const customIdsFromConfig = (values["customTranslators"] || []) as string[];
    const customIdSet = new Set([
      ...customIdsFromProviders,
      ...customIdsFromConfig,
    ]);
    const filterExistingWithCustom = (engines: any[]) =>
      Array.from(new Set(engines || [])).filter(
        (id) => hasTranslator(String(id)) || customIdSet.has(String(id))
      );
    const enabled = filterExistingWithCustom(config["translator-enabled"] || []);
    const activeSet = new Set(
      getEnabledWithCustomIds(enabled, [...customIdSet])
    );
    const cleanGroup = (group: any[]) =>
      filterExistingWithCustom(group || []).filter((id) => activeSet.has(id));
    config["translator-enabled"] = enabled;
    config["translator-cache"] = cleanGroup(config["translator-cache"]);
    config["translator-compare"] = cleanGroup(config["translator-compare"]);
    config["translator-double"] = cleanGroup(config["translator-double"]);
    store.dispatch("setConfig", config);
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

  getConfig2Save() {
    let config2Save: { [key: string]: string } = store.state.config;
    this.notSavingKeys.map((key) => delete config2Save[key]); //去掉不需要保存的
    return config2Save;
  }

  save() {
    writeFileSync(this.file, JSON.stringify(this.getConfig2Save(), null, 4));
    const now = Date.now();
    if (now > this.lastSave) {
      this.lastSave = now;
    }
  }

  private updateSnapshots(snapshots: ConfigSnapshots) {
    this.set("configSnapshots", snapshots);
    bus.iat("configSnapshot"); //通知快照列表更新
    bus.iat("delConfigSnapshot");
  }

  newSnapshot(name: string) {
    const snapshot: ConfigSnapshot = JSON.parse(
      JSON.stringify(this.getConfig2Save())
    );
    delete snapshot["configSnapshots"]; //这个不删除的话会越搞越多
    const snapshots = this.get<ConfigSnapshots>("configSnapshots");
    if (snapshots[name] != undefined) {
      delete snapshots[name];
    }
    const newSnapshots = {
      ...snapshots,
      [name]: snapshot,
    };
    this.updateSnapshots(newSnapshots);
  }

  delSnapshot(name: string) {
    const snapshots = this.get<ConfigSnapshots>("configSnapshots");
    if (snapshots[name] != undefined) {
      delete snapshots[name];
    }
    const newSnapshots = {
      ...snapshots,
    };
    this.updateSnapshots(newSnapshots);
  }

  resumeSnapshot(name: string) {
    const snapshot = this.get<ConfigSnapshots>("configSnapshots")[name];
    const resume = (key: Identifier) => {
      let val = snapshot[key];
      const rule = this.getRule(key);
      let invalid: boolean =
        rule.minimalVersion != undefined &&
        isLower(snapshot["version"], rule.minimalVersion as string);
      //config的版本小于这项rule的最低版本，则需要更新为最新的预定义值
      invalid = invalid || !this.checkValid(key, val);
      if (invalid) {
        return;
      }
      if (key == "layoutType") {
        this.set(key, val, true, false); //必须要禁止preset才能
      } else {
        this.set(key, val);
      }
    };
    const keys: Identifier[] = Object.keys(snapshot) as Identifier[];
    for (const key of keys) {
      if (key == "layoutType") {
        continue;
      }
      resume(key);
    }
    resume("layoutType"); //最后才设置，不然会被覆盖，这样才能恢复
  }
}

export { ConfigParser };
