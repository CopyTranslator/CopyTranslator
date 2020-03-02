import { dialog, nativeImage } from "electron";
import { env } from "../env";

const enWarning =
  "Ctrl + C is simulated when the drag copy is triggered. In most scenes, this means safe text copying, but in some scenes it may cause some unexpected problems, such as clipboard data being overwritten.  Triggering Ctrl + C in the shell will interrupt the running program and so on.  When you enable it, please be aware that after you enable the drag and drop option, you will be responsible for any possible losses.";
const zhWarning =
  "拖拽复制触发时会模拟Ctrl+C，大部分情况下，这都意味着安全的文本复制，但在某些场景中可能会引起一些意料之外的问题，如剪贴板数据被覆盖、在shell中触发Ctrl+C会使正在运行的程序中断等等。启用时请务必注意，当您启用拖拽复制选项后，任何可能由此导致的损失均由您自行负责。";

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
