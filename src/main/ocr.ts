const AipOcrClient = require("baidu-aip-sdk").ocr;
const ba64 = require("ba64");
import fs from "fs";
import { examToken } from "@/common/translate/token";
import eventBus from "@/common/event-bus";
const ShortcutCapture = require("shortcut-capture");
export const shortcutCapture = new ShortcutCapture();

export class Recognizer {
  client: any;

  constructor() {
    shortcutCapture.on("capture", (data: any) =>
      this.recognize(data["dataURL"])
    );
  }

  setUp(config: {
    app_id: string;
    api_key: string;
    secret_key: string;
  }): boolean {
    if (!examToken(config)) {
      this.client = undefined;
      return false;
    }
    const { app_id, api_key, secret_key } = config;
    this.client = new AipOcrClient(app_id, api_key, secret_key);

    return true;
  }

  capture() {
    shortcutCapture.shortcutCapture();
  }

  recognize(image: string) {
    if (!this.client) {
      return;
    }
    ba64.writeImageSync("temp", image);
    image = fs.readFileSync("temp.png").toString("base64");
    this.client
      .generalBasic(image)
      .then(function (result: { words_result: Array<{ words: string }> }) {
        const text = result.words_result
          .map((item) => item["words"])
          .join("\n");
        eventBus.at("dispatch", "translate", text);
      })
      .catch(function (err: any) {
        // 如果发生网络错误
        console.log(err);
      });
    fs.unlink("temp.png", () => {});
  }
}
export const recognizer = new Recognizer();
