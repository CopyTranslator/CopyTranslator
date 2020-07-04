import axios_, { AxiosRequestConfig } from "axios";
import { SocksProxyAgent, SocksProxyAgentOptions } from "socks-proxy-agent";

const ssrProxy = {
  host: "127.0.0.1",
  port: 1080,
};

export let axios: any = axios_.create();

export const setProxy = (info?: SocksProxyAgentOptions) => {
  if (info) {
    const httpsAgent = new SocksProxyAgent(info);
    const axiosOptions: AxiosRequestConfig = {
      httpAgent: httpsAgent,
      httpsAgent,
      proxy: false,
    };
    axios = axios_.create(axiosOptions);
  } else {
    axios = axios_.create();
  }
  return axios;
};
