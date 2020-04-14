import {
  ipcRenderer,
  IpcRendererEvent,
  ipcMain,
  IpcMainEvent,
  BrowserWindow
} from "electron";

let bus = require("@gotoeasy/bus");
const id = "gbus";
const isMain = process.type == "browser";
const ipc = isMain ? ipcMain : ipcRenderer;
type Event = IpcMainEvent | IpcRendererEvent;

bus.gon = (key: string, listener: (event: Event, ...args: any[]) => void) => {
  const channel = `${id}-${key}`;
  bus.on(channel, listener);
  ipc.on(channel, listener);
};

bus.gonce = (key: string, listener: (event: Event, ...args: any[]) => void) => {
  const channel = `${id}-${key}`;
  ipc.once(channel, listener);
  bus.once(channel, listener);
};

bus.gat = (key: string, ...args: any[]) => {
  const channel = `${id}-${key}`;
  if (!isMain) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach(e => {
      e.webContents.send(channel, ...args);
    });
  }

  bus.at(channel, null, ...args);
};

bus.goff = (key: string, listener: (event: Event, ...args: any[]) => void) => {
  const channel = `${id}-${key}`;
  ipc.removeListener(channel, listener);
  bus.off(channel, listener);
};

export default bus;
