function fetchPage(url) {
  fetch(b64_to_utf8(url))
    .then((response) => response.text())
    .then((text) => {
      document.getElementById("container").innerHTML = marked.parse(text);
      redirectLinks();
    });
}
