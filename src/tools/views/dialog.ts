import { dialog, nativeImage } from "electron";
import { env } from "../env";

let enWarning: string;
let zhWarning: string;
if (global.process.platform == "linux") {
  enWarning =
    'For the first time, perform "sudo groupmens -g input $USER" at the terminal, then logout and log back into the desktop environment, to listen for mouse events globally. \
    \nNote: dragCopy of the Linux version does not actually copy the selected text to the clipboard.';
  zhWarning =
    "首次使用此功能请在终端执行”sudo groupmens -g input $USER“，然后重新登录桌面环境，以便全局监听鼠标事件。\
    \n注意：Linux版本的 “拖拽复制” 实际上并不会将选中的文本复制到剪切板。";
} else {
  enWarning =
    "Ctrl + C is simulated when the drag copy is triggered. In most scenes, this means safe text copying, but in some scenes it may cause some unexpected problems, such as clipboard data being overwritten.  Triggering Ctrl + C in the shell will interrupt the running program and so on.  When you enable it, please be aware that after you enable the drag and drop option, you will be responsible for any possible losses.";
  zhWarning =
    "拖拽复制触发时会模拟Ctrl+C，大部分情况下，这都意味着安全的文本复制，但在某些场景中可能会引起一些意料之外的问题，如剪贴板数据被覆盖、在shell中触发Ctrl+C会使正在运行的程序中断等等。启用时请务必注意，当您启用拖拽复制选项后，任何可能由此导致的损失均由您自行负责。";
}

export function showDragCopyWarning() {
  if (
    global.controller &&
    global.controller.win.window &&
    !global.controller.get("neverShow")
  ) {
    const t = global.controller.getT();
    dialog
      .showMessageBox(global.controller.win.window, {
        title: "声明/Warning",
        message: [enWarning, zhWarning].join("\n"),
        buttons: [t("neverShow"), t("ok")],
        icon: nativeImage.createFromPath(env.iconPath)
      })
      .then(res => res.response)
      .then(response => {
        switch (response) {
          case 0:
            global.controller.set("neverShow", true);
            break;
          case 1:
            break;
        }
      });
  }
}
