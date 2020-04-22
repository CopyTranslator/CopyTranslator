interface Operation {
  key: string;
  args: any[];
}

function delay(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const newMethod = function(...args: any[]) {
    if (target["clipboard"] == undefined) {
      target["operations"].push({
        key: propertyKey,
        args
      });
      return;
    } else {
      const clipboard = target["clipboard"];
      return clipboard[propertyKey].call(clipboard, ...args);
    }
  };
  descriptor.value = newMethod; // 替换原声明
}

class ClipboardWarpper {
  static clipboard: any = undefined;
  static operations: Array<Operation> = [];
  static init() {
    ClipboardWarpper.clipboard = require("electron-clipboard-extended");
    ClipboardWarpper.operations.forEach(operation => {
      return ClipboardWarpper.clipboard[operation["key"]].call(
        ClipboardWarpper.clipboard,
        ...operation["args"]
      );
    });
    ClipboardWarpper.operations = [];
  }

  @delay
  static on(...args: any[]) {}

  @delay
  static writeText(text: string) {}

  /**
   * @param text selection(仅支持Linux X11桌面环境，获取鼠标选中的文本)
   */
  @delay
  static readText(text?: string): any {}

  @delay
  static startWatching() {}

  @delay
  static stopWatching() {}

  @delay
  static readImage(): any {}
}

export const clipboard = ClipboardWarpper;
