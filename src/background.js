"use strict";

import { app, protocol, BrowserWindow, clipboard } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");

let currentWorkingDir = process.cwd();

let DB = null;
let win;
import datastore from "nedb-promise";
const ioHook = require("iohook");
const translate = require("translate-google");

function mountLibraries() {
  clipboard.writeText("Example String", "selection");
  console.log(clipboard.readText("selection"));
  const tranObj = {
    a: 1,
    b: "1",
    c: "How are you?\nI'm nice.",
    d: [true, "true", "hi", { a: "hello", b: ["world"] }]
  };

  translate(tranObj, { to: "zh-cn" })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });

  global.translate = translate;
  global.clipboard = clipboard;
  global.ioHook = ioHook;
}

async function doDatabaseStuff() {
  DB = datastore({
    // these options are passed through to nedb.Datastore
    filename: path.join(process.cwd(), "copytranslator-db.json"),
    autoload: true // so that we don't have to call loadDatabase()
  });
  // await DB.insert([
  //   {
  //     num: 1,
  //     time: new Date(),
  //     alpha: "什么东西啊"
  //   },
  //   {
  //     num: 2,
  //     time: new Date(),
  //     alpha: "b"
  //   }
  // ]);
  global.db = DB;
}

const bindMouseEvent = () => {
  ioHook.on("mousedown", event => {
    win.webContents.send("news", event);
  });
  //注册的指令。send到主进程main.js中。
  // Register and start hook
  ioHook.start(false);
};

const createPyProc = () => {
  doDatabaseStuff();
  bindMouseEvent();
  mountLibraries();
};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(["app"], { secure: true });
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    frame: false,
    toolbar: false
  });
  win.setAlwaysOnTop(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
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
  if (win === null) {
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
