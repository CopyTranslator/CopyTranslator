var fs = require("fs");

enum RuleName {
  isCopy,
  isListen,
  isDete,
  stayTop,
  smartDict,
  autoHide,
  autoShow,
  autoTop,
  frameMode,
  translatorType,
  fontsize,
  focusBounds,
  contrastBounds,
  source,
  target,
  locale
}

const nocheck = (value: any) => {
  return true;
};
type CheckFuction = (value: any) => boolean;
type Rules = { [key: string]: Rule }; //类型别名

interface Rule {
  predefined: any;
  msg: string;
  check?: CheckFuction; // 检查是否有效的函数
}

class ConfigParser {
  rules: Rules = {};
  values: { [key: string]: string | number | boolean } = {};
  constructor() {}
  addRule(key: RuleName, rule: Rule) {
    let keyValue = ConfigParser.getValue(key);
    if (rule.check && !rule.check(rule.predefined)) {
      throw "Rule " + key + " is invald!";
    }
    this.rules[keyValue] = rule;
    this.values[keyValue] = rule.predefined;
  }
  static getValue(key: RuleName): string {
    return RuleName[key];
  }
  loadValues(fileName: string) {
    var values = fs.readFileSync(fileName);
  }
  saveValues(fileName: string) {}
}

export { Rule, ConfigParser, CheckFuction, RuleName, nocheck };
