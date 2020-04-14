import {
  ipcRenderer,
  IpcRendererEvent,
  ipcMain,
  IpcMainEvent,
  BrowserWindow
} from "electron";
import { EventType, Identifier } from "./types";

type SimpleType = EventType | Identifier;
let bus = require("@gotoeasy/bus");
const id = "gbus";
const isMain = process.type == "browser";
const ipc = isMain ? ipcMain : ipcRenderer;
type Event = IpcMainEvent | IpcRendererEvent | null;
type Listener = (event: Event, ...args: any[]) => void;

bus.gon = (key: string, listener: Listener) => {
  const channel = `${id}-${key}`;
  bus.on(channel, listener);
  ipc.on(channel, listener);
};

bus.gonce = (key: string, listener: Listener) => {
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

bus.goff = (key: string, listener: Listener) => {
  const channel = `${id}-${key}`;
  ipc.removeListener(channel, listener);
  bus.off(channel, listener);
};

interface GBus {
  on: (key: SimpleType, listener: Function) => void;
  once: (key: SimpleType, listener: Function) => void;
  at: (key: SimpleType, ...args: any[]) => void;
  off: (key: SimpleType, listener: Function) => void;
  gon: (key: SimpleType, listener: Listener) => void;
  gonce: (key: SimpleType, listener: Listener) => void;
  gat: (key: SimpleType, ...args: any[]) => void;
  goff: (key: SimpleType, listener: Listener) => void;
}

export default bus as GBus;
