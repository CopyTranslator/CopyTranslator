
class Config {
  _default_value:object={
    author: "Elliott Zheng",
    version: "hello",
    is_listen: true,
    is_copy: false,
    is_dete: false,
    stay_top: false,
    continus: false,
    smart_dict: true,
    frame_mode: "",
    translator_type: "",
    font_size: 15,
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
    language: "Chinese (Simplified)", //language of ui
    autohide: false,
    autoshow: false,
    autoTop: false
  };
  constructor() {
    
  }
}

let config = new Config();
