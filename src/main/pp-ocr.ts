const { resolve: path_resolve } = require("path");
import { env } from "@/common/env";
import logger from "@/common/logger";
import eventBus from "@/common/event-bus";
import { examToken } from "@/common/translate/token";

const ocr_thread_file = require("path").join(
  env.externalResource,
  "ocr_thread.js"
);

class Queue extends Array {
  public status: boolean = false;
  constructor() {
    super();
  }
  shift() {
    this.length &&
      Promise.resolve(this[0]()).then(
        () => (super.shift(), this.status && this.shift())
      );
  }
  push(cb: any): number {
    super.push(cb) - 1 || (this.status && this.shift());
    return 0;
  }
}

import { Worker } from "worker_threads";
export class PPOCRWorker extends Worker {
  private queue: any;
  constructor(
    path: null | string,
    args: string[],
    options: any,
    debug: boolean
  ) {
    if (!path) {
      path = "PaddleOCR_json.exe";
    }
    debug = !!debug;
    super(ocr_thread_file, {
      workerData: { path, args, options, debug },
    });
    this.queue = new Queue();
    super.once("message", (code: any) => {
      console.log(code);
      this.queue.status = true;
      this.queue.shift();
    });
  }
  get length() {
    return this.queue.length;
  }
  postMessage(obj: any) {
    return new Promise((res) => {
      const queue = this.queue;
      obj = Object.assign({}, obj);
      if (obj.image_dir === null) obj.image_dir = "clipboard";
      else obj.image_dir = path_resolve(obj.image_dir);
      queue.push(
        () =>
          new Promise((res_: any) => {
            super.once(
              "message",
              (data: any) => (
                res({
                  code: data.code,
                  message: data.code - 100 ? data.data : "",
                  data: data.code - 100 ? null : data.data,
                }),
                res_()
              )
            );
            super.postMessage(obj);
          })
      );
    });
  }
  flush(obj: any) {
    return this.postMessage(obj);
  }
}

interface PaddleResult {
  box: any;
  score: number;
  text: string;
}

export class PaddlePaddleRecognizer {
  worker: any = null;

  constructor() {}

  enabled(): boolean {
    return !!this.worker;
  }

  setUp(config: { cwd: string; config_name: string }) {
    if (!examToken(config)) {
      return;
    }
    const { cwd, config_name } = config;
    this.worker = new PPOCRWorker(
      "PaddleOCR_json.exe",
      [`--config_path=${config_name}`],
      {
        cwd: cwd,
      },
      false
    );
    this.worker.on("error", () => {
      this.worker = null;
      console.log("PP OCR初始化失败");
      logger.toast("PP OCR initialize fail.", true);
    });
  }

  onExit() {
    if (this.enabled()) {
      this.worker.terminate();
    }
  }

  recognize_clipboard() {
    if (!this.enabled()) {
      return;
    }
    this.worker
      .postMessage({ image_dir: null })
      .then(function (res: { data: PaddleResult[] }) {
        const text = res.data.map((res) => res.text).join("\n");
        logger.toast("PP OCR完成，正在翻译");
        eventBus.at("dispatch", "translate", text);
      })
      .catch(function (err: any) {
        // 如果发生网络错误Z
        console.log(err);
        logger.toast("PP OCR失败");
      });
  }
}

export const pp_recognizer = new PaddlePaddleRecognizer();
