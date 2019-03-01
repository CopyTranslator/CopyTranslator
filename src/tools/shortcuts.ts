import {Accelerator} from "electron";

interface Shortcut {
    accelerator: Accelerator;
    id: string;
}

type Shortcuts = { [key: string]: string };
const defaultShortcuts: Shortcuts = {listenClipboard: "CommandOrControl+J"};

export {Shortcut, defaultShortcuts, Shortcuts};
