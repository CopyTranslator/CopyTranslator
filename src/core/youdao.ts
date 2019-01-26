import axios from "axios";
import { TouchBarButton } from "electron";
import cheerio from "cheerio";

class YoudaoSpider {
  readonly error_code = {
    0: "正常",
    20: "要翻译的文本过长",
    30: "无法进行有效的翻译",
    40: "不支持的语言类型",
    50: "无效的key",
    60: "无词典结果，仅在获取词典结果生效",
    70: "无法连接到Youdao"
  };

  async query(expression: string) {
    // Make a request for a user with a given ID
    try {
      let res = await axios.get(
        `http://dict.youdao.com/w/eng/${expression}/#keyfrom=dict2.index`
      );
      YoudaoSpider.parseHtml(expression, res.data);
    } catch (e) {
      console.log(e);
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
      errorCode: 0
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
        console.log(result["basic"]["explains"]);
        // 音标
        let phons = basic
          .find(".phonetic")
          .map((i: number, el) => {
            return $(el).text();
          })
          .get();
        console.log(phons);
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
      console.log(web.text());
      result["web"] = web
        .find(".wordGroup")
        .map((i: number, wordGroup) => {
          return $(wordGroup)
            .text()
            .replace(/ +/g, " ")
            .replace(/[\r\n\t]/g, "");
          // {
          //   key: $(wordGroup)
          //     .find(".search-js")
          //     .first()
          //     .text(),
          //   value: $(wordGroup)
          //     .find("span")
          //     .first()
          //     .next()
          //     .text()
          // };
          //
        })
        .get();
      console.log(result["web"]);
    }
    return result;
  }
}

export { YoudaoSpider };
