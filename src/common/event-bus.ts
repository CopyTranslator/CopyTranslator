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

const getChannel = (key: string) => `${id}-${key}`;

for (const methodName of ["on", "once", "at", "off"]) {
  const method = bus[methodName];
  bus[methodName] = (key: string, ...args: any[]) => {
    const channel = getChannel(key);
    return method(channel, ...args);
  };
}

bus.gon = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  bus.on(key, listener);
  ipc.on(channel, listener);
};

bus.gonce = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  ipc.once(channel, listener);
  bus.once(key, listener);
};

bus.gat = (key: string, ...args: any[]) => {
  const channel = getChannel(key);
  if (!isMain) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach(e => {
      e.webContents.send(channel, ...args);
    });
  }
  bus.at(key, null, ...args);
};

bus.goff = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  ipc.removeListener(channel, listener);
  bus.off(key, listener);
};

bus.ion = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  ipc.on(channel, listener);
};

bus.ionce = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  ipc.once(channel, listener);
};

bus.iat = (key: string, ...args: any[]) => {
  const channel = getChannel(key);
  if (!isMain) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach(e => {
      e.webContents.send(channel, ...args);
    });
  }
};

bus.ioff = (key: string, listener: Listener) => {
  const channel = getChannel(key);
  ipc.removeListener(channel, listener);
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
  ion: (key: SimpleType, listener: Listener) => void;
  ionce: (key: SimpleType, listener: Listener) => void;
  iat: (key: SimpleType, ...args: any[]) => void;
  ioff: (key: SimpleType, listener: Listener) => void;
}

export default bus as GBus;
