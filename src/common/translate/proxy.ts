import axios_, { AxiosRequestConfig } from "axios";
import { net } from "electron";
export const setProxy = (info?: boolean) => {
  if (info) {
    const axiosOptions: AxiosRequestConfig = {
      adapter: (config) => {
        delete config.adapter;
        if (
          (config.url as string).indexOf("google") != -1 &&
          config.method == "get"
        ) {
          //仅在google翻译中使用网页代理

          return new Promise(function (resolve, reject) {
            const request = net.request(config.url as string);
            console.log(config.url);
            request.on("response", (response) => {
              response.on("data", (chunk) => {
                if (response.statusCode != 200) {
                  reject(response.statusCode);
                  return;
                }
                try {
                  resolve({
                    data: JSON.parse(chunk.toString()),
                    status: response.statusCode, // 接口的http 状态
                    statusText: response.statusMessage,
                    headers: response.headers,
                    config,
                  });
                } catch (e) {
                  reject(e);
                }
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
      // httpAgent: httpsAgent,
      // httpsAgent,
      // proxy: false,
    };
    return axios_.create(axiosOptions);
  } else {
    return axios_.create();
  }
};

export let axios: any = setProxy(true);
