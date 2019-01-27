"use strict";
import { app, protocol, BrowserWindow, clipboard } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const ipc = require("electron").ipcMain;
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
import CONSTANT from "./tools/constant";

let currentWorkingDir = process.cwd();
let isFollow = false;

let x = 0;
let y = 0;

let DB = null;
let focusWin: any;
import datastore from "nedb-promise-ts";
const ioHook = require("iohook");
const translator = require("translate-google");

import { configParser } from "./tools/rules";

// let ciba = new YoudaoSpider();
// ciba.query("test").then(res => {
//   console.log(res);
// });
console.log(configParser.rules);
console.log(configParser.values);

//挂载库
function mountLibraries() {
  (<any>global).translator = translator;
  (<any>global).clipboard = clipboard;
  (<any>global).ioHook = ioHook;
  (<any>global).CONSTANT = CONSTANT;
}
//绑定事件
function bindEvents() {
  //拖动窗口事件,主要是针对
  ipc.on(CONSTANT.ONDRAGWINDOW, function(event: any, arg: any) {
    isFollow = arg.status;
    x = arg.x;
    y = arg.y;
  });
  ipc.on(CONSTANT.ONMINIFYWINDOW, function(event: any, arg: any) {
    focusWin.minimize();
  });
}

async function doDatabaseStuff() {
  DB = new datastore({
    // these options are passed through to nedb.Datastore
    filename: path.join(process.cwd(), "copytranslator-db.json"),
    autoload: true // so that we don't have to call loadDatabase()
  });
  (<any>global).db = DB;
}

const sendMouseEvent = () => {
  ioHook.on("mousedown", (event: MouseEvent) => {
    focusWin.webContents.send("news", event);
  });
  ioHook.on("mouseup", (event: MouseEvent) => {
    isFollow = false;
  });
  ioHook.on("mousedrag", (event: MouseEvent) => {
    if (isFollow && event.button === 0) {
      let x_now = event.x;
      let y_now = event.y;
      let dx = x_now - x;
      let dy = y_now - y;
      x = x_now;
      y = y_now;
      let bounds = focusWin.getBounds();
      bounds.x += dx;
      bounds.y += dy;
      focusWin.setBounds(bounds);
    }
  });

  //注册的指令。send到主进程main.js中。
  // Register and start hook
  ioHook.start(false);
};

//create main process
const createPyProc = () => {
  doDatabaseStuff();
  sendMouseEvent();
  mountLibraries();
  bindEvents();
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  // Create the browser window.
  focusWin = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    frame: false
  });
  focusWin.setAlwaysOnTop(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    focusWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) focusWin.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    focusWin.loadURL("app://./index.html");
  }

  focusWin.on("closed", () => {
    focusWin = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (focusWin === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createPyProc();
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
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
