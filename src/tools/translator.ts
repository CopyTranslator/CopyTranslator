import {TranslatorType} from "./enums";
import {GoogleLangList, GoogleCodes, GoogleLanguages, isChineseLike} from "./languages";
import {youdao, baidu, google} from "translation.js";

var _ = require("lodash");

abstract class Translator {

    abstract getLanguages(): [string];

    abstract lang2code(lang: string): string;

    async translate(
        text: string,
        src: string,
        dest: string
    ): Promise<string | undefined> {
        const from = this.lang2code(src);
        const to = this.lang2code(dest);
        text = text.replace(/([?？！!.。][ ]?)/g, "$1##");
        let sentences = _.split(text, "##");
        const _translate = this._translate;
        let promises = sentences.map(async (sentence: string) => {
            return new Promise(async function (resolve, reject) {
                try {
                    let res = await _translate(sentence, from, to);
                    resolve(res);
                } catch (e) {
                    reject();
                }
            })
        });
        try {
            let values = await Promise.all(promises);
            return _.join(values, isChineseLike(to) ? "" : " ");
        } catch (e) {
            return undefined;
        }
    };

    abstract _translate(
        text: string,
        from: string,
        to: string
    ): Promise<string | undefined>;

    abstract detect(text: string): Promise<string | undefined>; //return lang
}

class GoogleTranslator extends Translator {
    com: boolean = false;

    constructor(com = false) {
        super();
        this.com = com;
    }

    getLanguages() {
        return GoogleLangList;
    }

    lang2code(lang: string) {
        return GoogleLanguages[lang];
    }

    async _translate(
        text: string,
        from: string,
        to: string
    ): Promise<string | undefined> {
        try {
            let res = await google.translate({
                text: text,
                from: from,
                to: to,
                com: this.com
            });
            return _.join(res.result, isChineseLike(to) ? "" : " ");
        } catch (e) {
            console.log(e);
            return "";
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

export {Translator, GoogleTranslator};
