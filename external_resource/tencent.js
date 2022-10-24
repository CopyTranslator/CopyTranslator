const DL_PREFIX = "<__COPYTRANSLATOR__>";
const dom = document.querySelector(".textinput");

function setInput(st) {
  var evt = new InputEvent("input", {
    inputType: "insertText",
    data: st,
    dataTransfer: null,
    isComposing: false,
  });
  dom.value = st;
  dom.dispatchEvent(evt);
  dom.click();
}

function b64_to_utf8(str) {
  //解决中文乱码问题
  return decodeURIComponent(escape(window.atob(str)));
}

var languageList = {
  auto: "自动识别",
  zh: "中文",
  en: "英语",
  jp: "日语",
  kr: "韩语",
  fr: "法语",
  es: "西班牙语",
  it: "意大利语",
  de: "德语",
  tr: "土耳其语",
  ru: "俄语",
  pt: "葡萄牙语",
  vi: "越南语",
  id: "印尼语",
  th: "泰语",
  ms: "马来西亚语",
  ar: "阿拉伯语",
  hi: "印地语",
};

var languagePair = {
  auto: [
    "zh",
    "en",
    "jp",
    "kr",
    "fr",
    "es",
    "it",
    "de",
    "tr",
    "ru",
    "pt",
    "vi",
    "id",
    "th",
    "ms",
  ],
  en: [
    "zh",
    "fr",
    "es",
    "it",
    "de",
    "tr",
    "ru",
    "pt",
    "vi",
    "id",
    "th",
    "ms",
    "ar",
    "hi",
  ],
  zh: [
    "en",
    "jp",
    "kr",
    "fr",
    "es",
    "it",
    "de",
    "tr",
    "ru",
    "pt",
    "vi",
    "id",
    "th",
    "ms",
  ],
  fr: ["zh", "en", "es", "it", "de", "tr", "ru", "pt"],
  es: ["zh", "en", "fr", "it", "de", "tr", "ru", "pt"],
  it: ["zh", "en", "fr", "es", "de", "tr", "ru", "pt"],
  de: ["zh", "en", "fr", "es", "it", "tr", "ru", "pt"],
  tr: ["zh", "en", "fr", "es", "it", "de", "ru", "pt"],
  ru: ["zh", "en", "fr", "es", "it", "de", "tr", "pt"],
  pt: ["zh", "en", "fr", "es", "it", "de", "tr", "ru"],
  vi: ["zh", "en"],
  id: ["zh", "en"],
  ms: ["zh", "en"],
  th: ["zh", "en"],
  jp: ["zh"],
  kr: ["zh"],
  ar: ["en"],
  hi: ["en"],
};

// 语言名字 转 语言ID  例："英语" -> "en"
function getLanguageId(text) {
  for (var index in languageList) {
    if (text.indexOf(languageList[index]) >= 0) {
      return index;
    }
  }
  return "auto";
}

function setSource(source_lang) {
  const source_lang_text = languageList[source_lang];
  const spans = document
    .querySelector("ul[node-type=source_language_list]")
    .querySelectorAll("span");
  const langs = Array.from(spans).map((elem) => {
    return elem.textContent;
  });
  const idx = langs.indexOf(source_lang_text);
  spans[idx].click();
}

function setTarget(target_lang) {
  const target_lang_text = languageList[target_lang];
  const target_spans = document
    .querySelector("ul[node-type=target_language_list]")
    .querySelectorAll("span");
  const tgt_langs = Array.from(target_spans).map((elem) => {
    return elem.textContent;
  });
  const idx = tgt_langs.indexOf(target_lang_text);
  target_spans[idx].click();
}

function inputValue(from, to, base64Text) {
  setInput("");
  setSource(from);
  setTarget(to);
  var st = b64_to_utf8(base64Text);
  setInput(st);
}

function getFrom() {
  let shown_from = document
    .querySelector("div[node-type=source_language_button]")
    .textContent.trim();
  if (shown_from.startsWith("检测到")) {
    shown_from = shown_from.substring(3);
  }
  return getLanguageId(shown_from);
}

function getTo() {
  const shown_to = document
    .querySelector("div[node-type=target_language_button]")
    .textContent.trim();
  return getLanguageId(shown_to);
}

const resultDom = document.querySelector(
  "div[node-type=textpanel-target-textblock]"
);

function getResult() {
  const from = getFrom();
  const to = getTo();
  const results = Array.from(
    resultDom.querySelectorAll("span[class=text-dst]")
  ).map((elem) => elem.textContent.trim());
  return {
    from: from,
    to: to,
    targetText: results,
  };
}

const target = resultDom;
// Create an observer instance.
const observer = new MutationObserver(function (mutations) {
  if (target.textContent.trim().length > 0) {
    const result = getResult();
    console.log(`${DL_PREFIX}`, JSON.stringify(result));
  }
});
// Pass in the target node, as well as the observer options.
observer.observe(target, {
  // attributes: true, //simpleDebug
  childList: true, //内容发生变化
  subtree: true,
  // characterData: true,
});
