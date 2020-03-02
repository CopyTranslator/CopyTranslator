import * as https from "https";
type RaceGetResult = Promise<{ key: string; data: any } | undefined>;

const mirrors = {
  github: "https://copytranslator.github.io",
  gitee: "https://copytranslator.gitee.io"
};

function promiseGet(key: string, url: string) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        res.on("data", data => {
          resolve({
            key: key,
            data: JSON.parse(data)
          });
        });
      })
      .on("error", e => {
        reject(e);
      });
  });
}
export async function raceGet(url: string): RaceGetResult {
  let promises = Object.entries(mirrors).map(async ([key, mirror]) => {
    return new Promise(async function(resolve, reject) {
      try {
        let res = await promiseGet(key, mirror + url);
        resolve(res);
      } catch (e) {
        reject(e);
      }
    });
  });
  try {
    let winner: any = await Promise.race(promises);
    return winner;
  } catch (e) {
    return undefined;
  }
}
