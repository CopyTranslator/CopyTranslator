function autoDownload() {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("confirm-update");
}

const callback = (event, data) => {
  const releaseNote = data.needCompile
    ? marked.parse(data.releaseNotes)
    : data.releaseNotes;

  let version = data.releaseName;
  version = `<h1>${version}</h1>`;
  const isWin = data.isWin;
  let buttons = [
    `<button type="button" id='manual' class="button">手动下载更新</button>`,
  ];
  if (isWin) {
    buttons.push(
      `<button type="button" id='auto' class="button">自动下载更新</button>`
    );
  }
  document.getElementById("releaseNote").innerHTML =
    version + `<div style="text-align:center;">${buttons}</div>` + releaseNote;
  if (isWin) {
    document.getElementById("auto").onclick = autoDownload;
  }
  document.getElementById("manual").onclick = () => {
    const { shell } = require("electron");
    shell.openExternal(data.manualLink);
  };
  redirectLinks();
};
// data = {
//   releaseNotes:
//     '<div data-pjax="true" data-test-selector="body-content" data-view-component="true" class="markdown-body my-3"><ol> <li>拖拽复制现支持程序白名单/黑名单模式，再也不用担心在某些不想要的程序触发了，在设置-&gt;拖拽复制页面进行设置。 <a href="https://github.com/CopyTranslator/CopyTranslator/issues/475" data-hovercard-type="issue" data-hovercard-url="/CopyTranslator/CopyTranslator/issues/475/hovercard">#475</a></li> <li>增加<a href="https://github.com/thedaviddelta/lingva-translate">Lingva</a>作为除谷歌翻译镜像以及<a href="https://simplytranslate.org/" rel="nofollow">Simply</a>之外的另一个Google翻译源，更多详见<a href="https://copytranslator.gitee.io/guide/questions.html#%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E9%80%80%E5%87%BA%E4%B8%AD%E5%9B%BD%E5%B8%82%E5%9C%BA%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88" rel="nofollow">此处</a></li> <li>增加翻译引擎Keyan，此引擎由<a href="https://www.keyanyuedu.com/?channel=copytranslator" rel="nofollow">棵岩阅读</a>免费提供给CopyTranslator用户使用，暂时仅支持英译中。感谢<a href="https://www.keyanyuedu.com/?channel=copytranslator" rel="nofollow">棵岩阅读</a>对CopyTranslator的支持。</li> <li>改进设置界面UI</li> <li>多源对比现在可以调节字体大小 <a href="https://github.com/CopyTranslator/CopyTranslator/issues/496" data-hovercard-type="issue" data-hovercard-url="/CopyTranslator/CopyTranslator/issues/496/hovercard">#496</a></li> <li>修复支持语言没有及时更新的问题</li> <li>增加备用引擎选项，以支持单向翻译器（如仅支持英译中而不支持中译英）的智能互译，可以在设置中更改备用引擎</li> <li>进一步改进配置文件在不同版本间的兼容性处理，对特定规则特定版本的兼容性处理</li> </ol></div>',
//   version: "v11.0.0",
//   releaseName: "快照机制快速切换",
// };
// callback(null, data);
require("electron").ipcRenderer.on("releaseNote", callback);
