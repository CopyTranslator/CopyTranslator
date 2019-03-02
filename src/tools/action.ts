import {
    globalShortcut,
    Menu,
    MenuItem,
    BrowserWindow,
    Accelerator
} from "electron";

var fs = require("fs");
import {RuleName} from "./rule";
import {ConfigParser, getEnumValue as r} from "./configParser";
import {Shortcut} from "./shortcuts";
import {envConfig} from "./envConfig";

//r can be used to transform a enum to string

enum MenuItemType {
    normal = "normal",
    separator = "separator",
    submenu = "submenu",
    checkbox = "checkbox",
    radio = "radio"
}

enum RouteName {
    Focus = "Focus",
    Contrast = "Contrast",
    Settings = "Settings",
    Tray = "Tray"
}

interface Action {
    label?: string;
    type: MenuItemType;
    checked?: boolean;
    id: string;
    click?: (
        menuItem: MenuItem,
        browserWindow: BrowserWindow,
        event: Event
    ) => void;
}

function ActionWrapper(action: Action, callback: Function) {
    var key = action.id;
    if (!action.click) {
        action.click = function (
            menuItem: MenuItem,
            browserWindow: BrowserWindow,
            event: Event
        ) {
            callback(key, menuItem, browserWindow, event);
        };
    }
    return action;
}

class ActionManager {
    actions: Array<Action>;
    shortcuts: { [key: string]: Accelerator } = {};
    callback: Function;

    constructor(callback: Function) {
        this.actions = [];
        this.callback = callback;
    }

    init() {
        this.actions = this.getActions(
            (<any>global).controller.config,
            this.callback
        );
        this.loadShortcuts();
        this.register();
    }

    refreshActions() {
        var controller = (<any>global).controller;
        let config = controller.config;
        var t = controller.getT();
        if (this.actions) {
            this.actions.forEach(e => {
                e.label = t(e.id);
                if (e.type == MenuItemType.checkbox) {
                    e.checked = config.values[e.id];
                }
            });
        }
    }

    getActions(config: ConfigParser, callback: Function) {
        let items: Array<Action> = [];

        function normalAction(id: string) {
            return ActionWrapper(
                {
                    type: MenuItemType.normal,
                    id: id
                },
                callback
            );
        }

        function switchAction(ruleName: RuleName) {
            const id = r(ruleName);
            return ActionWrapper(
                {
                    type: MenuItemType.checkbox,
                    checked: config.values[id],
                    id: id
                },
                callback
            );
        }

        items.push(normalAction("copySource"));
        items.push(normalAction("copyResult"));
        items.push(normalAction("clear"));
        items.push(normalAction("retryTranslate"));
        items.push(switchAction(RuleName.autoCopy));
        items.push(switchAction(RuleName.autoPaste));
        items.push(switchAction(RuleName.autoPurify));
        items.push(switchAction(RuleName.detectLanguage));
        items.push(switchAction(RuleName.incrementalCopy));
        items.push(switchAction(RuleName.autoHide));
        items.push(switchAction(RuleName.autoShow));
        items.push(switchAction(RuleName.stayTop));
        items.push(switchAction(RuleName.listenClipboard));
        items.push(switchAction(RuleName.tapCopy));
        items.push(normalAction("focusMode"));
        items.push(normalAction("contrastMode"));
        items.push(normalAction("settings"));
        items.push(normalAction("helpAndUpdate"));
        items.push(normalAction("exit"));
        return items;
    }

    popup(id: RouteName) {
        this.refreshActions();
        let menu = new Menu();
        var noContain: Array<string> = [];
        switch (id) {
            case RouteName.Focus:
                noContain = ["focusMode"];
                break;
            case RouteName.Contrast:
                noContain = ["contrastMode","retryTranslate"];
                break;
            case RouteName.Settings:
                noContain = ["settings"];
                break;
        }
        this.actions.filter(e => !noContain.includes(e.id)).forEach(item => {
            menu.append(new MenuItem(item));
        });
        menu.popup({});
    }


    loadShortcuts() {
        try {
            this.shortcuts = JSON.parse(
                fs.readFileSync(envConfig.sharedConfig.shortcut, "utf-8")
            );
        } catch (e) {
            fs.copyFileSync(
                envConfig.diffConfig.shortcutTemplate,
                envConfig.sharedConfig.shortcut
            );
            this.shortcuts = JSON.parse(
                fs.readFileSync(envConfig.sharedConfig.shortcut, "utf-8")
            );
        }
    }

    register() {
        Object.keys(this.shortcuts).forEach(key => {
            const action = this.actions.filter(t => key == t.id)[0];
            if (action) {
                globalShortcut.register(this.shortcuts[key], <Function>action.click);
            }
        });
    }

    unregister() {
        Object.values(this.shortcuts).forEach(accelerator => {
            globalShortcut.unregister(accelerator);
        });
    }
}

export {RouteName, ActionManager};
