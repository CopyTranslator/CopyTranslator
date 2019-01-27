import {
  ConfigParser,
  Rule,
  CheckFuction,
  RuleName,
  ModeConfig
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

class ModeRule implements Rule {
  predefined: ModeConfig;
  msg: string;
  check?: CheckFuction;
  constructor(predefined: ModeConfig, msg: string, check?: CheckFuction) {
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
  new BoolRule(false, "auto copy result to clipboard")
);

configParser.addRule(
  RuleName.autoHide,
  new BoolRule(false, "auto show when translate")
);

configParser.addRule(
  RuleName.isContinus,
  new BoolRule(false, "incremental copy")
);

configParser.addRule(
  RuleName.stayTop,
  new BoolRule(false, "always stay on top")
);

configParser.addRule(
  RuleName.smartDict,
  new BoolRule(true, "always stay on top")
);

configParser.addRule(
  RuleName.fontsize,
  new NumberRule(15, "font size of focus mode")
);

export { configParser };
