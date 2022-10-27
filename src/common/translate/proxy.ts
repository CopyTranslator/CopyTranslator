import axios_, { AxiosRequestConfig } from "axios";
import { net } from "electron";
const EventEmitter = require("events");

export const getProxyAxios = (info?: boolean, googleMirror?: string) => {
  if (info) {
    const axiosOptions: AxiosRequestConfig = {
      adapter: (config: AxiosRequestConfig) => {
        delete config.adapter;
        if (
          (config.url as string).indexOf("google") != -1 &&
          config.method == "get"
        ) {
          if (googleMirror != undefined && config.url != undefined) {
            config.url = config.url.replace(
              "https://translate.googleapis.com",
              googleMirror
            );
          }

          //仅在google翻译中使用网页代理
          return new Promise(function (resolve, reject) {
            const request = net.request(config.url as string);
            const localBus = new EventEmitter();
            request.on("response", (response) => {
              let globalChunk: Buffer | undefined = undefined;
              let chunks: string[] = [];
              let length: number = 0;
              let times: number = 0;
              localBus.on("done", () => {
                let text = chunks.join("");
                try {
                  resolve({
                    data: JSON.parse(text),
                    status: response.statusCode, // 接口的http 状态
                    statusText: response.statusMessage,
                    headers: response.headers,
                    config,
                  });
                } catch (e) {
                  console.log(config.url);
                  console.log(text);
                  reject(e);
                }
              });

              response.on("data", (mychunk) => {
                globalChunk = mychunk;
                //太神秘了，为什么要这样子才能接收到完整的数据
                function func() {
                  const currentChunk = (<Buffer>globalChunk).toString();
                  times += 1;
                  if (
                    chunks.length == 0 ||
                    chunks[chunks.length - 1] !== currentChunk
                  ) {
                    // console.log(times, currentChunk);
                    chunks.push(currentChunk);
                    setTimeout(func, 50);
                  } else {
                    localBus.emit("done");
                  }
                }
                func();
              });
            });
            request.on("error", (error) => {
              console.log(error);
              reject(error);
            });
            request.end();
          });
        } else {
          // 通过配置发起请求
          return axios_(config);
        }
      },
    };
    return axios_.create(axiosOptions);
  } else {
    return axios_.create();
  }
};

export let axios: any = getProxyAxios(true);
