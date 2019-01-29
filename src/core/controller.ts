const clipboard = require("electron-clipboard-extended");
import { Translator, GoogleTranslator } from "../tools/translator";
import { RuleName } from "../tools/rule";
import { config, ConfigParser } from "../tools/configuration";

clipboard
  .on("text-changed", () => {
    let currentText = clipboard.readText();
  })
  .once("text-changed", () => {
    console.log("TRIGGERED ONLY ONCE");
  })
  .on("image-changed", () => {
    let currentIMage = clipboard.readImage();
  });

clipboard.off("text-changed");

clipboard.stopWatching();

class Controller {
  src: string = "";
  result: string = "";
  lastAppend: string = "";
  translator: Translator = new GoogleTranslator();
  constructor(config: ConfigParser) {}
  stopWatch() {
    clipboard.stopWatching();
  }
}

export { Controller };
