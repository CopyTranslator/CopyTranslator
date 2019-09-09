import { engines, WordEngineType } from "./tools/dictionaries";
const engine = new engines[WordEngineType.Bing]();
engine.query("what are you talking about?").then((res: any) => {
  //   console.log(Object.keys(res[0].translates[0]));
  console.log(res);
});
