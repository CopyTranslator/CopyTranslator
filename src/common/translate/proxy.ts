import axios_, { AxiosRequestConfig } from "axios";
var http = require("http");
var ProxyAgent = require("proxy-agent");

// HTTP, HTTPS, or SOCKS proxy to use
var proxyUri = "pac+http://127.0.0.1:25378/echo-pac?t=1692484";

export let axios: any = axios_.create();

export const setProxy = (info?: boolean) => {
  if (info) {
    const httpsAgent = new ProxyAgent(proxyUri);
    console.log(proxyUri);
    const axiosOptions: AxiosRequestConfig = {
      httpAgent: httpsAgent,
      // httpsAgent,
      proxy: false,
    };
    axios = axios_.create(axiosOptions);
    axios.get("http//google.com").then(function (response: any) {
      // handle success
      console.log(response);
    });
  } else {
    axios = axios_.create();
  }
  return axios;
};
