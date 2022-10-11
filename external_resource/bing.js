const dom = document.getElementById("tta_input_ta");

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

function inputValue(from, to, base64Text) {
  document.getElementById("tta_clear").click();
  document.getElementById("tta_srcsl").value = from;
  document.getElementById("tta_tgtsl").value = to;
  var st = b64_to_utf8(base64Text);
  setInput(st);
}
