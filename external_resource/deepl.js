const DL_PREFIX = "<__COPYTRANSLATOR__>";

var target = document.querySelector("#target-dummydiv");
// Create an observer instance.
var observer = new MutationObserver(function (mutations) {
  if (target.textContent.trim().length > 0) {
    const state = window._tState;
    const result = {
      targetText: state.targetText,
      sourceLang: state._sourceLang,
      targetLangSettings: state._targetLangSettings,
    };
    console.log(`${DL_PREFIX}`, JSON.stringify(result));
  }
});

// Pass in the target node, as well as the observer options.
observer.observe(target, {
  // attributes: true, //simpleDebug
  childList: true, //内容发生变化
  // characterData: true,
});

// .lmt__language_select__active

function setLang(from, to) {
  document.querySelector(`button[dl-test=translator-source-lang-btn]`).click();
  document
    .querySelector("div[dl-test=translator-source-lang-list]")
    .querySelector(".lmt__language_wrapper")
    .querySelector(`button[dl-test="translator-lang-option-${from}"]`)
    .click();
  document.querySelector(`button[dl-test=translator-target-lang-btn]`).click();
  document
    .querySelector("div[dl-test=translator-target-lang-list]")
    .querySelector(".lmt__language_wrapper")
    .querySelector(`button[dl-test="translator-lang-option-${to}"]`)
    .click();
}

const dom = document.querySelector(".lmt__source_textarea");
function setInput(st) {
  var evt = new InputEvent("input", {
    inputType: "insertText",
    data: st,
    dataTransfer: null,
    isComposing: false,
  });
  dom.value = st;
  dom.dispatchEvent(evt);
}

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function inputValue(from, to, base64Text) {
  setInput(""); //先重置一下，确保有结果的更新
  setLang(from, to);
  var st = b64_to_utf8(base64Text);
  setInput(st);
}
