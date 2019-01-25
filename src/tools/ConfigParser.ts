interface Rule {
  default: string | number | boolean;
  type: string; //类型，包括 number，string ,
  msg: string;
  check: (value: string | number | boolean) => boolean; // 检查是否有效的函数
}

type Rules = { [key: string]: Rule }; //类型别名

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
  loadValues(fileName: string) {}
  saveValues(fileName: string) {}
}
