import { env } from "@/common/env";
import { BrowserWindow, ipcMain, remote } from "electron";

const url = require("url");
const path = require("path");

const DEFAULT_WIDTH = 370;
const DEFAULT_KEYBIND_WIDTH = 420;
const DEFAULT_COUNTER_WIDTH = 300;
const DEFAULT_HEIGHT = 200;
const DEFAULT_KEYBIND_HEIGHT = (options: any) => options.length * 50 + 130;

export function electronPrompt(options: any, parentWindow?: BrowserWindow) {
  const dirname = path.join(env.externalResource, "prompt");

  return new Promise((resolve, reject) => {
    //id used to ensure unique listeners per window
    const id = `${Date.now()}-${Math.random()}`;

    //custom options override default
    const width =
      options.type === "counter"
        ? DEFAULT_COUNTER_WIDTH
        : options.type === "keybind"
        ? DEFAULT_KEYBIND_WIDTH
        : DEFAULT_WIDTH;
    const height =
      options.type === "keybind" && options.keybindOptions
        ? DEFAULT_KEYBIND_HEIGHT(options.keybindOptions)
        : DEFAULT_HEIGHT;
    const options_ = Object.assign(
      {
        width,
        height,
        resizable: false,
        title: "Prompt",
        label: "Please input a value:",
        buttonLabels: null,
        alwaysOnTop: false,
        value: null,
        type: "input",
        selectOptions: null,
        keybindOptions: null,
        counterOptions: { minimum: null, maximum: null, multiFire: false },
        icon: null,
        useHtmlLabel: false,
        customStylesheet: null,
        menuBarVisible: false,
        skipTaskbar: true,
        frame: true,
        customScript: null,
        enableRemoteModule: false,
      },
      options || {}
    );

    if (options_.customStylesheet === "dark") {
      options_.customStylesheet = require("path").join(
        dirname,
        "dark-prompt.css"
      );
    }

    for (const type of ["counter", "select", "keybind", "multiInput"]) {
      if (
        options_.type === type &&
        (!options_[`${type}Options`] ||
          typeof options_[`${type}Options`] !== "object")
      ) {
        reject(
          new Error(`"${type}Options" must be an object if type = ${type}`)
        );
        return;
      }
    }

    options_.minWidth = options.minWidth || options.width || options_.width;
    options_.minHeight = options.minHeight || options.height || options_.height;

    let promptWindow: BrowserWindow | null = new BrowserWindow({
      frame: options_.frame,
      width: options_.width,
      height: options_.height,
      minWidth: options_.minWidth,
      minHeight: options_.minHeight,
      resizable: options_.resizable,
      minimizable:
        !options_.skipTaskbar && !parentWindow && !options_.alwaysOnTop,
      fullscreenable: options_.resizable,
      maximizable: options_.resizable,
      parent: parentWindow,
      skipTaskbar: options_.skipTaskbar,
      alwaysOnTop: options_.alwaysOnTop,
      useContentSize: options_.resizable,
      modal: Boolean(parentWindow),
      title: options_.title,
      icon: options_.icon || undefined,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: options_.enableRemoteModule,
      },
      show: false,
    });

    if (options_.enableRemoteModule) {
      throw "not implemented";
      //   remote.enable(promptWindow.webContents);
    }

    promptWindow.setMenu(null);
    promptWindow.setMenuBarVisibility(options_.menuBarVisible);

    //called on exit
    const cleanup = () => {
      ipcMain.removeListener("prompt-get-options:" + id, getOptionsListener);
      ipcMain.removeListener("prompt-post-data:" + id, postDataListener);
      ipcMain.removeListener("prompt-error:" + id, errorListener);
      //   if (parentWindow) parentWindow.focus();

      if (promptWindow != null) {
        promptWindow.destroy();
        promptWindow = null;
      }
    };

    ///transfer options to front
    const getOptionsListener = (event: any) => {
      if (options_.button)
        options_.button.click = "(" + new String(options_.button.click) + ")()";

      event.returnValue = JSON.stringify(options_);
    };

    //get input from front
    const postDataListener = (event: any, value: any) => {
      if (options_.type === "keybind" && value) {
        for (let i = 0; i < value.length; i++) {
          value[i] = JSON.parse(value[i]);
        }
      }
      resolve(value);
      event.returnValue = null;
      cleanup();
    };

    const unresponsiveListener = () => {
      reject(new Error("Window was unresponsive"));
      cleanup();
    };

    //get error from front
    const errorListener = (event: any, message: any) => {
      reject(new Error(message));
      event.returnValue = null;
      cleanup();
    };

    //attach listeners
    ipcMain.once("prompt-get-options:" + id, getOptionsListener);
    ipcMain.once("prompt-post-data:" + id, postDataListener);
    ipcMain.once("prompt-error:" + id, errorListener);
    promptWindow.once("unresponsive", unresponsiveListener);

    promptWindow.once("close", () => {
      resolve(null);
      cleanup();
    });

    //should never happen
    promptWindow.webContents.once(
      "did-fail-load",
      (_event, errorCode, errorDescription, validatedURL) => {
        const log = {
          error: "did-fail-load",
          errorCode,
          errorDescription,
          validatedURL,
        };
        reject(
          new Error("prompt.html did-fail-load, log:\n" + JSON.stringify(log))
        );
      }
    );

    const promptUrl = url.format({
      protocol: "file",
      slashes: true,
      pathname: path.join(dirname, "page", "prompt.html"),
      hash: id,
    });

    //Finally, load prompt
    promptWindow.loadURL(promptUrl);

    // show window only when ready
    promptWindow.once("ready-to-show", () => {
      if (promptWindow) {
        promptWindow.show();
      }
    });
  });
}
