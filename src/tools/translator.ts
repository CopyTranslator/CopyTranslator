import {TranslatorType} from "./enums";
import {GoogleLangList, GoogleCodes, GoogleLanguages} from "./languages";
import {youdao, baidu, google} from "translation.js";
import {Phonetic, TranslateResult} from "translation.js/declaration/api/types";

var _ = require("lodash");


/*
在短时间内请求多次，会被谷歌直接封掉IP，所以上一次commit试图通过多次异步请求后组合并没有什么卵用
 */
/** 统一的查询结果的数据结构 */
interface MyTranslateResult extends TranslateResult {
    resultString?: string;
}


abstract class Translator {

    abstract getLanguages(): [string];

    abstract lang2code(lang: string): string;

    abstract code2lang(code: string): string;

    abstract translate(
        text: string,
        srcCode: string,
        destCode: string
    ): Promise<MyTranslateResult | undefined>;

    abstract detect(text: string): Promise<string | undefined>; //return lang
}

class GoogleTranslator extends Translator {
    getLanguages() {
        return GoogleLangList;
    }


    lang2code(lang: string) {
        return GoogleLanguages[lang];
    }

    code2lang(code: string): string {
        return GoogleCodes[code];
    }

    async translate(
        text: string,
        srcCode: string,
        destCode: string
    ): Promise<MyTranslateResult | undefined> {
        try {
            let res: MyTranslateResult = await google.translate({
                text: text,
                from: srcCode,
                to: destCode
            });
            res.resultString = _.join(res.result, " ");
            return res;
        } catch (e) {
            (<any>global).log.debug(e);
            return undefined;
        }
    }

    async detect(text: string): Promise<string | undefined> {
        try {
            let lang = await google.detect(text);
            return lang;
        } catch (e) {
            (<any>global).log.debug(e);
            return undefined;
        }
    }
}

export {Translator, GoogleTranslator, MyTranslateResult};
