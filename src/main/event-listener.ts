import simulate from "./simulate";
import os from "os";
import { clipboard } from "./clipboard";
import eventBus from "../common/event-bus";
import config from "../common/configuration";
import iohook from "iohook";

class EventListener {
  drag = false;
  lastDown = Date.now();
  lastX = 0;
  lastY = 0;
  newY = 0;
  newX = 0;
  copied: boolean = false;
  // Just for linux x11
  selectedText: string = clipboard.readText("selection");
  preLeftBtn: string = "mouseup";
  lastClick = Date.now();
  lastClickX = 0;
  lastClickY = 0;

  lastCopy = Date.now();

  bind() {
    eventBus.gonce("firstLoad", (event: any, args: any) => {
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
        if (config.get("dragCopy")) {
          // global.controller.tryTranslate(selectedText);
        }
      }

      // 更新鼠标按钮状态
      this.preLeftBtn = event.leftBtn;
    });
  }

  simulateCopy() {
    simulate.copy();
    eventBus.at("dispatch", "toast", "模拟复制");
  }

  bindHooks() {
    // windows和mac上的监听
    const ioHook = require("iohook");

    ioHook.on("keydown", (event: any) => {
      if (event.keycode == 46 && event.ctrlKey) {
        //双击ctrl c 可以在没有开监听剪贴板的情况下 翻译
        const now = Date.now();
        if (
          now - this.lastCopy < 1000 &&
          config.get("enableDoubleCopyTranslate")
        ) {
          console.debug("triggered double ctrl c", clipboard.readText());
          eventBus.at("dispatch", "doubleCopyTranslate");
        }
        this.lastCopy = now;
      }
    });

    ioHook.on("mouseup", (event: MouseEvent) => {
      //模拟点按复制
      if (
        config.get("dragCopy") &&
        config.get("listenClipboard") &&
        !this.copied &&
        Date.now() - this.lastDown > 100 &&
        Math.abs(this.newX - this.lastX) + Math.abs(this.newY - this.lastY) > 10
      ) {
        this.simulateCopy();
        if (event.ctrlKey) {
          eventBus.at("dispatch", "incrementSelect");
        }
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

    iohook.on("mouseclick", (event: MouseEvent) => {
      const now = Date.now();
      const newY = event.y;
      const newX = event.x;
      if (
        config.get("listenClipboard") &&
        config.get("dragCopy") &&
        config.get("doubleClickCopy") &&
        now - this.lastDown < 500 &&
        Math.abs(newX - this.lastClickX) < 4 &&
        Math.abs(newY - this.lastClickY) < 4
      ) {
        this.simulateCopy();
      }
      this.lastClick = now;
      this.lastClickX = event.x;
      this.lastClickY = event.y;
    });

    //注册的指令。send到主进程main.js中。
    // Register and start hook
    ioHook.start(false);
  }
}

export const eventListener = new EventListener();
