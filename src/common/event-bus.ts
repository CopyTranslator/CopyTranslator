import {
  ipcRenderer,
  IpcRendererEvent,
  ipcMain,
  IpcMainEvent,
  BrowserWindow,
} from "electron";
import { EventType, Identifier } from "./types";

type SimpleType = EventType | Identifier;
const bus = require("@gotoeasy/bus");
const id = "gbus";
const isMain = process.type == "browser";
const ipc = isMain ? ipcMain : ipcRenderer;
type Event = IpcMainEvent | IpcRendererEvent | null;
const ipcListenerMap = new Map<string, Map<Function, (...args: any[]) => void>>();

function listenWrapper(listener: Function) {
  return (event: Event, ...args: any[]) => {
    listener(...args);
  };
}

function getListenerMap(key: string) {
  if (!ipcListenerMap.has(key)) {
    ipcListenerMap.set(key, new Map());
  }
  return ipcListenerMap.get(key)!;
}

const getChannel = (key: string) => `${id}-${key}`;

for (const methodName of ["on", "once", "at", "off"]) {
  const method = bus[methodName];
  bus[methodName] = (key: string, ...args: any[]) => {
    const channel = getChannel(key);
    return method(channel, ...args);
  };
}

bus.ion = (key: string, listener: Function) => {
  const channel = getChannel(key);
  const map = getListenerMap(key);
  const wrapped = listenWrapper(listener);
  map.set(listener, wrapped);
  ipc.on(channel, wrapped);
};

bus.ionce = (key: string, listener: Function) => {
  const channel = getChannel(key);
  const map = getListenerMap(key);
  const wrapped = listenWrapper(listener);
  map.set(listener, wrapped);
  ipc.once(channel, (event: Event, ...args: any[]) => {
    wrapped(event, ...args);
    const stored = map.get(listener);
    if (stored) {
      map.delete(listener);
    }
  });
};

bus.ioff = (key: string, listener: Function) => {
  const channel = getChannel(key);
  const map = getListenerMap(key);
  const wrapped = map.get(listener);
  if (wrapped) {
    ipc.removeListener(channel, wrapped);
    map.delete(listener);
  }
};

bus.iat = (key: string, ...args: any[]) => {
  const channel = getChannel(key);
  if (!isMain) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach((e) => {
      e.webContents.send(channel, ...args);
    });
  }
};

bus.gon = (key: string, listener: Function) => {
  bus.on(key, listener);
  bus.ion(key, listener);
};

bus.gonce = (key: string, listener: Function) => {
  bus.once(key, listener);
  bus.ionce(key, listener);
};

bus.goff = (key: string, listener: Function) => {
  bus.off(key, listener);
  bus.ioff(key, listener);
};

bus.gat = (key: string, ...args: any[]) => {
  const channel = getChannel(key);
  if (!isMain) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach((e) => {
      e.webContents.send(channel, ...args);
    });
  }
  bus.at(key, ...args);
};

interface GBus {
  on: (key: SimpleType, listener: Function) => void;
  once: (key: SimpleType, listener: Function) => void;
  at: (key: SimpleType, ...args: any[]) => void;
  off: (key: SimpleType, listener: Function) => void;
  gon: (key: SimpleType, listener: Function) => void;
  gonce: (key: SimpleType, listener: Function) => void;
  goff: (key: SimpleType, listener: Function) => void;
  gat: (key: SimpleType, ...args: any[]) => void;
  ion: (key: SimpleType, listener: Function) => void;
  ionce: (key: SimpleType, listener: Function) => void;
  ioff: (key: SimpleType, listener: Function) => void;
  iat: (key: SimpleType, ...args: any[]) => void;
}

export default bus as GBus;
