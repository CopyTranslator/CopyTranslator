function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function redirectLinks() {
  const { shell } = require("electron");
  const aTags = document.getElementsByTagName("a");
  for (var i = 0; i < aTags.length; i++) {
    const href = aTags[i].href;
    aTags[i].onclick = () => {
      shell.openExternal(href);
    };
    aTags[i].href = "#";
  }
}
