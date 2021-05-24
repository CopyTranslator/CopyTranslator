"use strict";
import { app, protocol } from "electron";
const gotTheLock = app.requestSingleInstanceLock();

console.time("before-ready");

//确保全局单例
if (!gotTheLock) {
  console.error("Another instance is running");
  app.exit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到window这个窗口
    const window = global.controller.win.get("contrast");
    if (window.isMinimized()) {
      window.restore();
    }
    window.focus();
  });
}
import { initLog } from "./common/logger";
initLog();
import { Controller } from "./main/controller";

const isDevelopment = process.env.NODE_ENV !== "production";

app.allowRendererProcessReuse = false;
app.setAppUserModelId("com.copytranslator.copytranslator");

const controller = new Controller();
global.controller = controller;

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { standard: true, secure: true } },
]);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", (event) => {
  event.preventDefault();
  controller.onExit();
});

app.on("activate", (event, hasVisibleWindows) => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!hasVisibleWindows) {
    controller.createWindow();
  }
});

// 禁用本地缓存
// app.commandLine.appendSwitch("--disable-http-cache");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // await installVueDevtools();
  }
  console.timeEnd("before-ready");
  controller.createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
