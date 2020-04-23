import simulate from "./simulate";
import os from "os";
import { clipboard } from "./clipboard";
import bus from "../common/event-bus";
import eventBus from "../common/event-bus";
class EventListener {
  drag = false;
  dragCopy = false;
  lastDown = Date.now();
  lastX = 0;
  lastY = 0;
  newY = 0;
  newX = 0;
  copied: boolean = false;
  // Just for linux x11
  selectedText: string = clipboard.readText("selection");
  preLeftBtn: string = "mouseup";

  bind() {
    bus.gonce("firstLoad", (event: any, args: any) => {
      eventBus.at("dispatch", "checkUpdate");
    });

    if (os.platform() !== "linux") {
      this.bindHooks();
    } else {
      this.bindLinuxHooks();
    }
  }

  /**
   * 只监听了鼠标事件
   */
  bindLinuxHooks() {
    const Mouse = require("node-mouse");
    const m = new Mouse();

    m.on("mousedown", (event: any) => {
      // 按住鼠标拖动的时候也会触发此事件
      // 如果原本按钮就是pressed状态，则直接返回，不做处理
      if (this.preLeftBtn) {
        return;
      }

      this.selectedText = clipboard.readText("selection");
      // console.debug("mousedown: ", this.selectedText);
      // 更新鼠标按钮状态
      this.preLeftBtn = event.leftBtn;
    });

    m.on("mouseup", (event: any) => {
      // console.debug(event)
      console.debug("mouseup", clipboard.readText("selection"));
      const selectedText = clipboard.readText("selection");
      if (this.selectedText != selectedText) {
        // 按下时选中的文本和释放时选中的文本不一致，则表示选中文本发生了变化
        console.debug("selected text changed:", selectedText);
        if (this.dragCopy) {
          // global.controller.tryTranslate(selectedText);
        }
      }

      // 更新鼠标按钮状态
      this.preLeftBtn = event.leftBtn;
    });
  }

  bindHooks() {
    const ioHook = require("iohook");
    ioHook.on("mouseup", (event: MouseEvent) => {
      //模拟点按复制
      if (
        this.dragCopy &&
        !this.copied &&
        Date.now() - this.lastDown > 100 &&
        Math.abs(this.newX - this.lastX) + Math.abs(this.newY - this.lastY) > 10
      ) {
        simulate.copy();
        this.copied = true;
      }
    });

    ioHook.on("mousedown", (event: MouseEvent) => {
      this.lastDown = Date.now();
      this.lastX = event.x;
      this.lastY = event.y;
      this.copied = false;
    });

    ioHook.on("mousedrag", (event: MouseEvent) => {
      this.drag = true;
      this.newX = event.x;
      this.newY = event.y;
    });
    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

export const eventListener = new EventListener();
