const AipOcrClient = require("baidu-aip-sdk").ocr;
const ba64 = require("ba64");
import fs from "fs";

export class Recognizer {
  client: any;
  setUp(force = false) {
    const controller = global.controller;
    const APP_ID = controller.get("APP_ID");
    const API_KEY = controller.get("API_KEY");
    const SECRET_KEY = controller.get("SECRET_KEY");
    if (force || (APP_ID != "" && API_KEY != "" && SECRET_KEY != "")) {
      this.client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
    }
  }

  recognize(image: string) {
    if (!this.client) {
      return;
    }
    image = image.substring(image.indexOf(",") + 1);
    this.client
      .generalBasic(image)
      .then(function(result: any) {
        (<any>global).controller.postProcessImage(result["words_result"]);
      })
      .catch(function(err: any) {
        // 如果发生网络错误
        console.log(err);
      });
  }
}
export let recognizer = new Recognizer();
