import { TranslatorType, FrameMode, version } from "./constant";
class Config {
  _default_value: object = {
    author: "Elliott Zheng",
    version: version,
    isListen: true,
    isCopy: false,
    isDete: false,
    isContinus: false,
    stayTop: false,
    smartDict: true,
    autoHide: false,
    autoShow: false,
    autoTop: false,
    frameMode: FrameMode.Focus,
    translatorType: TranslatorType.Google,
    fontSize: 15,
    bounds: {
      //location of focus mode
      focus: {
        x: 100,
        y: 100,
        height: 300,
        width: 500
      },
      contrast: {
        x: 100,
        y: 100,
        height: 300,
        width: 500
      }
    },
    source: "English", // source language
    target: "Chinese (Simplified)", //traget language
    language: "Chinese (Simplified)" //language of ui
  };
  constructor() {}
}

export { Config };
