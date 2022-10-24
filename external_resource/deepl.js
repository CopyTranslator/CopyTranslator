const DL_PREFIX = "<__COPYTRANSLATOR__>";

const target = document.querySelector("#target-dummydiv");
// Create an observer instance.
const observer = new MutationObserver(function (mutations) {
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

const dom = document.querySelector(".lmt__source_textarea");
function setInput(st) {
  const evt = new InputEvent("input", {
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

function inputValue(from, to, base64Text) {
  setInput(""); //先重置一下，确保有结果的更新
  setLang(from, to);
  const st = b64_to_utf8(base64Text);
  setInput(st);
}

const isActive = dl_pageState.releaseGroups.some(function (r) {
  return r.name === "DF-2974" && r.variant === 2;
});
//deepl 有两种页面结构，非常地神奇，isActive表示第二种结构启用了
console.log("isActive", isActive);

var lang = null;
const bus = new EventTarget();

function setLangV2(from, to, callback) {
  lang = from;
  bus.addEventListener(
    "done",
    () => {
      bus.addEventListener("done", callback, { once: true });
      lang = to;
      document
        .querySelector(`button[dl-test=translator-target-lang-btn]`)
        .click();
    },
    { once: true }
  );
  document.querySelector(`button[dl-test=translator-source-lang-btn]`).click(); //https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget
}

if (isActive) {
  //deepl 有两种页面结构，这里面是处理第二种的,目前尚不知道这两种页面出现的原因
  const target2 = document.querySelector("#popover_container");
  // Create an observer instance.
  const observer2 = new MutationObserver(function (mutations) {
    if (mutations[0].addedNodes.length > 0) {
      //这个添加节点的事件完成后，我们就可以点击选项了，点击完之后，就会触发删除节点的事件
      if (lang == null) {
        return;
      }
      document
        .querySelector("#popover_container")
        .querySelector(`button[dl-test="translator-lang-option-${lang}"]`)
        .click();
      // console.log(lang);
      lang = null;
    } else {
      //这个删除节点的事件会在设置完成时触发
      bus.dispatchEvent(new Event("done"));
    }
  });

  observer2.observe(target2, {
    childList: true, //内容发生变化
    subtree: true,
  });

  function inputValueV2(from, to, base64Text) {
    setInput(""); //先重置一下，确保有结果的更新
    const st = b64_to_utf8(base64Text);
    setLangV2(from, to, () => {
      setInput(st);
    });
  }
  inputValue = inputValueV2;
}
