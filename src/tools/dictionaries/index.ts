import { GoogleEngine, YoudaoEngine, BingEngine } from "./easy";

export enum WordEngineType {
  Google = "google",
  Youdao = "youdao",
  Bing = "bing"
}

export const engines: { [key: string]: any } = {
  bing: BingEngine,
  google: GoogleEngine,
  youdao: YoudaoEngine
};
