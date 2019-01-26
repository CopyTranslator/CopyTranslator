var fs = require("fs");

type CheckFuction = (value: string | number | boolean) => boolean;
type Rules = { [key: string]: Rule }; //类型别名

interface Rule {
  default: string | number | boolean;
  msg: string;
  check: CheckFuction; // 检查是否有效的函数
}

class ConfigParser {
  rules: Rules = {};
  values: { [key: string]: string | number | boolean } = {};
  constructor(rules: Rules) {
    for (let key in rules) {
      this.addRule(key, rules[key]);
    }
  }
  addRule(key: string, rule: Rule) {
    if (!rule.check(rule.default)) {
      throw "Rule " + key + " is invald!";
    }
    this.rules[key] = rule;
    this.values[key] = rule.default;
  }
  loadValues(fileName: string) {
    var values = fs.readFileSync(fileName);
  }
  saveValues(fileName: string) {}
}
