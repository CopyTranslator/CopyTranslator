import axios_, { AxiosRequestConfig } from "axios";
import { net } from "electron";
const https = require("https");
const defaultGoogleAPI = "https://translate.googleapis.com";

export const getProxyAxios = (info?: boolean, googleMirror?: string) => {
  if (info) {
    const axiosOptions: AxiosRequestConfig = {
      timeout: 5000,
      adapter: (config: AxiosRequestConfig) => {
        delete config.adapter;
        if ((config.url as string).startsWith(defaultGoogleAPI)) {
          if (googleMirror != undefined && config.url != undefined) {
            config.url = config.url.replace(defaultGoogleAPI, googleMirror);
            config.method = "post";
            return axios_(config).then((res) => {
              if (typeof res.data !== "string") {
                return res; //没有遇到阻碍
              } else {
                throw "API MIRROR FAIL";
              }
            });
          }
          console.log(config.url);

          //仅在google翻译中使用网页代理
          return new Promise(function (resolve, reject) {
            // console.log(`[GoogleTranslate] Request start: ${config.url}`);

            const request = net.request({
              url: config.url as string,
              method: config.method,
            });
            
            request.on("response", (response) => {
              // const startTime = Date.now();
              // console.log(`[GoogleTranslate] Response received. Status: ${response.statusCode}`);
              
              let chunks: Buffer[] = [];
              
              response.on("data", (chunk) => {
                chunks.push(chunk);
              });

              response.on("end", () => {
                // console.log(`[GoogleTranslate] Request done. Content download time: ${Date.now() - startTime}ms`);
                const text = Buffer.concat(chunks).toString();
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
                  console.log("google translate input=", text);
                  reject(e);
                }
              });

              response.on("error", (error) => {
                 console.error(`[GoogleTranslate] Response error:`, error);
                 reject(error);
              });
            });

            request.on("error", (error) => {
              console.error(`[GoogleTranslate] Request error:`, error);
              reject(error);
            });
            request.end();
          });
        } else {
          // 通过配置发起请求
          console.log(`[Proxy] Direct axios request: ${config.url}`);
          return axios_(config);
        }
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    };
    return axios_.create(axiosOptions);
  } else {
    return axios_.create({timeout:5000});
  }
};

export let axios: any = getProxyAxios(true);
