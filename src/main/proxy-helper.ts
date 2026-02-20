import { NetworkProxyConfig } from "../common/rule";
import { axios } from "../common/translate/proxy";
import { session } from "electron";
import * as https from "https";

// Lazy load proxy-agent to avoid bundling issues in renderer
// This file should only be imported by the main process
const ProxyAgent = require("proxy-agent");

export const updateAxiosProxy = (proxyConfig: NetworkProxyConfig, enable: boolean) => {
  if (enable) {
    const protocol = proxyConfig.protocol || "http";
    const host = proxyConfig.host;
    const port = proxyConfig.port;
    const username = proxyConfig.username;
    const password = proxyConfig.password;

    let auth = "";
    if (username && password) {
      auth = `${username}:${password}@`;
    }

    // 优化 SOCKS5：使用 socks5h 以支持远程 DNS 解析，防止本地 DNS 污染及提升速度
    let proxyProtocol: string = protocol;
    if (protocol === "socks5") {
      proxyProtocol = "socks5h";
    }

    const proxyUri = `${proxyProtocol}://${auth}${host}:${port}`;
    const agent = new ProxyAgent(proxyUri);

    // 关键性能优化：开启 Keep-Alive
    // 避免每次请求都重新建立 TCP 连接和 SSL 握手
    agent.keepAlive = true;

    axios.defaults.httpAgent = agent;
    axios.defaults.httpsAgent = agent;

    if (session && session.defaultSession) {
      // Electron/Chromium 会自动处理 SOCKS5 的远程 DNS
      const rule = `${protocol}://${host}:${port}`;
      session.defaultSession.setProxy({
        proxyRules: rule,
      });
    }
  } else {
    axios.defaults.httpAgent = undefined;
    axios.defaults.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    if (session && session.defaultSession) {
      session.defaultSession.setProxy({
        proxyRules: "",
      });
    }
  }
};
