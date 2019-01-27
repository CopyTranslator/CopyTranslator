import {
  ConfigParser,
  Rule,
  CheckFuction,
  RuleName,
  nocheck
} from "./ConfigParser";

class BoolRule implements Rule {
  predefined: boolean;
  msg: string;
  constructor(predefined: boolean, msg: string) {
    this.predefined = predefined;
    this.msg = msg;
  }
}

class NumberRule implements Rule {
  predefined: number;
  msg: string;
  check?: CheckFuction;
  constructor(predefined: number, msg: string, check?: CheckFuction) {
    this.predefined = predefined;
    this.msg = msg;
    if (check) {
      this.check = check;
    }
  }
}
//start to add rules

let configParser = new ConfigParser();

configParser.addRule(
  RuleName.isListen,
  new BoolRule(true, "Listen to Clipboard")
);
configParser.addRule(
  RuleName.isCopy,
  new BoolRule(true, "auto copy result to clipboard")
);

configParser.addRule(
  RuleName.autoHide,
  new BoolRule(true, "auto show when translate")
);

configParser.addRule(
  RuleName.fontsize,
  new NumberRule(15, "font size of focus mode")
);

export { configParser };
