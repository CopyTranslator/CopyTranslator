import axios from "axios";
import cheerio from "cheerio";
import { YoudaoStatus } from "./enums";

class YoudaoSpider {
  async query(expression: string) {
    try {
      let res = await axios.get(
        `http://dict.youdao.com/w/eng/${expression}/#keyfrom=dict2.index`
      );
      return YoudaoSpider.parseHtml(expression, res.data);
    } catch (e) {
      console.log(e);
      return {
        status: YoudaoStatus.Fail
      };
    }
  }
  static parseHtml(word: string, html: string): Object {
    /*
    解析web版有道的网页
    :param html:网页内容
    :return:result
    */
    let result: { [key: string]: any } = {
      query: "",
      errorCode: YoudaoStatus.Success
    };
    const $ = cheerio.load(html);

    let root = $("#results-contents");

    // query 搜索的关键字
    let keyword = root.find(".keyword").first();
    if (keyword == null) {
      result["query"] = word;
    } else {
      result["query"] = keyword.text();
    }
    // 基本解释
    let basic = root.find("#phrsListTab").first();
    if (basic) {
      let trans = basic.find(".trans-container");

      if (trans) {
        result["basic"] = {};
        result["basic"]["explains"] = trans
          .find("li")
          .map((i: number, el) => {
            return $(el).text();
          })
          .get();

        // 中文
        if (result["basic"]["explains"].length == 0) {
          result["basic"]["explains"] = trans
            .find(".wordGroup")
            .map(function(i, el) {
              return $(el).text();
            })
            .get()
            .join(" ");
        }
        // 音标
        let phons = basic
          .find(".phonetic")
          .map((i: number, el) => {
            return $(el).text();
          })
          .get();
        if (phons.length == 2) {
          result["basic"]["uk-phonetic"] = phons[0];
          result["basic"]["us-phonetic"] = phons[1];
        } else if (phons.length == 1) {
          result["basic"]["phonetic"] = phons[0];
        }
      }
    }
    // 网络释义(短语)
    let web = root.find("#webPhrase");
    if (web) {
      result["web"] = web
        .find(".wordGroup")
        .map((i: number, wordGroup) => {
          let text = $(wordGroup)
            .find(".search-js")
            .first()
            .text();
          return {
            key: text,
            value: $(wordGroup)
              .text()
              .replace(text, "")
              .replace(/ {2,}/g, "")
              .replace(/[\r\n\t]/g, "")
              .replace(/\|{2,}/g, "")
          };
        })
        .get();
    }
    return result;
  }
}

export { YoudaoSpider };
