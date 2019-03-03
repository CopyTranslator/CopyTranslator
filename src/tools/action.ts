import {
    globalShortcut,
    Menu,
    MenuItem,
    BrowserWindow,
    Accelerator
} from "electron";

const fs = require("fs");
import {RuleName} from "./rule";
import {ConfigParser, getEnumValue as r} from "./configParser";
import {envConfig} from "./envConfig";
import {HideDirection} from "./enums";

const _ = require("lodash");

//r can be used to transform a enum to string


function compose(actions: Array<string>) {
    return _.join(actions, "|");
}

function decompose(id: string) {
    return id.split("|");
}

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
    submenu?: Array<Action>
    click?: (
        menuItem: MenuItem,
        browserWindow: BrowserWindow,
        event: Event
    ) => void;
}

function ActionWrapper(action: Action, callback: Function) {
    const key = action.id;
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

type Actions = { [key: string]: Action };

class ActionManager {
    actions: Actions = {};
    shortcuts: { [key: string]: Accelerator } = {};
    callback: Function;

    constructor(callback: Function) {
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
        const controller = (<any>global).controller;
        let config = controller.config;
        const t = controller.getT();
        for (let key in this.actions) {
            this.actions[key].label = t(key);
            if (this.actions[key].type == MenuItemType.checkbox) {
                this.actions[key].checked = config.values[key];
            }
        }
    }

    getActions(config: ConfigParser, callback: Function): Actions {
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

        function enumAction(ruleName: RuleName, type: any) {
            const id = r(ruleName);
            return ActionWrapper(
                {
                    type: MenuItemType.submenu,
                    id: id,
                    submenu:
                        Object.values(type).filter(
                            k => (typeof k as any) == "number"
                        ).map((e) => {
                            return ActionWrapper({
                                type: MenuItemType.normal,
                                id: compose([id, (<number>e).toString()]),
                                label: type[<number>e]
                            }, callback)
                        })
                },
                callback
            );
        }

        items.push(enumAction(RuleName.hideDirect, HideDirection));
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
        let itemGroup: Actions = {};
        items.forEach((e) => {
            itemGroup[e.id] = e;
        });
        return itemGroup;
    }

    popup(id: RouteName) {
        this.refreshActions();
        let menu = new Menu();
        let contain: Array<string> = [];
        const controller = (<any>global).controller;
        switch (id) {
            case RouteName.Focus:
                contain = controller.get(RuleName.focusMenu);
                break;
            case RouteName.Contrast:
                contain = controller.get(RuleName.contrastMenu);
                break;
            case RouteName.Tray:
            case RouteName.Settings:
                contain = Object.keys(this.actions);
                break;
        }
        contain.forEach(key => {
            menu.append(new MenuItem(this.actions[key]));
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
            const action = this.actions[key];
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

export {RouteName, ActionManager, compose, decompose};
