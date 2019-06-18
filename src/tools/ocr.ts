import { Controller } from "../core/controller";
import { RuleName } from "./rule";

const AipOcrClient = require("baidu-aip-sdk").ocr;
const ba64 = require("ba64");
const fs = require("fs");

export class Recognizer {
  client: any;
  setUp(force = false) {
    const controller = <Controller>(<any>global).controller;
    const APP_ID = controller.get(RuleName.APP_ID);
    const API_KEY = controller.get(RuleName.API_KEY);
    const SECRET_KEY = controller.get(RuleName.SECRET_KEY);
    if (force || (APP_ID != "" && API_KEY != "" && SECRET_KEY != "")) {
      this.client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
    }
  }

  recognize(image: string) {
    if (!this.client) {
      return;
    }
    ba64.writeImageSync("temp", image);
    image = fs.readFileSync("temp.png").toString("base64");
    this.client
      .generalBasic(image)
      .then(function(result: any) {
        (<any>global).controller.postProcessImage(result["words_result"]);
      })
      .catch(function(err: any) {
        // 如果发生网络错误
        console.log(err);
      });
    fs.unlink("temp.png", () => {});
  }
}
export let recognizer = new Recognizer();
