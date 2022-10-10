window.addEventListener("load", (event) => {
  meta = document.createElement("meta");
  meta.content = "script-src 'nonce-xxx or sha256-yyy' ";
  meta["http-equiv"] = "Content-Security-Policy";
  document.getElementsByTagName("head")[0].appendChild(meta);
});
