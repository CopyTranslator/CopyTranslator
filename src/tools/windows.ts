import { BrowserWindow, Rectangle, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { ColorStatus, HideDirection, MessageType, WinOpt } from "./enums";
import { ModeConfig, RuleName } from "./rule";
import { RouteName } from "./action";
import { loadStyles } from "./style";
import { Controller } from "@/core/controller";

class WindowWrapper {
  window: BrowserWindow | undefined = undefined;
  stored: string = RouteName.Focus;

  sendMsg(type: string, msg: any) {
    if (this.window) this.window.webContents.send(type, msg);
  }

  winOpt(type: WinOpt, args: any = null) {
    this.sendMsg(MessageType.WindowOpt.toString(), {
      type: type,
      args: args
    });
  }

  switchColor(color: ColorStatus) {
    this.winOpt(WinOpt.ChangeColor, color);
  }

  routeTo(routeName: string) {
    if (this.window) {
      this.window.focus();
      this.window.webContents.send(MessageType.Router.toString(), routeName);
      (<Controller>(<any>global).controller).setByKeyValue(
        "frameMode",
        routeName
      );
    }
  }

  load(routerName: RouteName = RouteName.Focus) {
    if (!this.window) return;
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      this.window.loadURL(
        process.env.WEBPACK_DEV_SERVER_URL + `/#/${routerName}`
      );
      if (!process.env.IS_TEST) this.window.webContents.openDevTools();
    } else {
      createProtocol("app");
      // Load the index.html when not in development
      this.window.loadURL(`file://${__dirname}/index.html#${routerName}`);
    }
    let windowPointer = this.window;
    this.window.webContents.on("did-finish-load", function() {
      windowPointer.webContents.insertCSS(loadStyles());
    });
    const that = this;
    this.window.on("blur", () => {
      that.edgeHide(that.onEdge());
    });
    this.window.on("focus", () => {
      that.edgeShow();
    });
  }

  setBounds(bounds: Rectangle) {
    if (this.window) {
      this.window.setBounds(bounds);
    }
  }

  onEdge() {
    if (!(<any>global).controller.get(RuleName.autoHide)) {
      return HideDirection.None;
    }
    let { x, y, width } = this.getBound();
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      this.getBound()
    ).bounds;
    x -= xBound;
    let xEnd = x + width;

    if (x <= 0) return HideDirection.Left;
    if (xEnd >= screenWidth) {
      return HideDirection.Right;
    }
    if (y <= 0) return HideDirection.Up;

    return HideDirection.None;
  }

  edgeHide(hideDirection: HideDirection) {
    const bound = this.getBound();
    let { x, y, width, height } = bound;
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      bound
    ).bounds;
    let xEnd = x + width;
    let yEnd = y + height;
    if (hideDirection == HideDirection.Up) {
      //TODO findout what's the problem
      while (yEnd > 10) {
        y--;
        yEnd--;
        this.setBounds({ x: x, y: y, width: width, height: height });
      }
    }
    switch (hideDirection) {
      case HideDirection.Up:
        while (yEnd > 10) {
          y--;
          yEnd--;
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case HideDirection.Left:
        while (xEnd >= xBound + 10) {
          x--;
          xEnd--;
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case HideDirection.Right:
        while (x < xBound + screenWidth - 10) {
          x++;
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case HideDirection.Minify:
        if (this.window) {
          this.window.minimize();
        }
        break;
    }
  }

  edgeShow() {
    let { x, y, width, height } = this.getBound();
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      this.getBound()
    ).bounds;
    let xEnd = x + width;
    let yEnd = y + height;
    while (x < xBound) {
      x++;
      xEnd++;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }

    while (xEnd > xBound + screenWidth) {
      x--;
      xEnd--;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }

    while (y < 0) {
      y++;
      yEnd++;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }
  }

  show(focus = true) {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore();
      if (focus) this.window.focus();
      this.window.moveTop();
    }
  }

  blur() {
    if (this.window) {
      this.window.blur();
    }
  }

  createWindow(routeName: RouteName) {
    let param: ModeConfig | undefined;
    switch (routeName) {
      case RouteName.Focus:
        param = (<any>global).controller.get(RuleName.focus);
        break;
      case RouteName.Contrast:
        param = (<any>global).controller.get(RuleName.contrast);
        break;
      case RouteName.Settings:
        param = (<any>global).controller.get(RuleName.settingsConfig);
        break;
      default:
        break;
    }
    if (!param) return;
    // Create the browser window.
    this.window = new BrowserWindow({
      x: param.x,
      y: param.y,
      width: param.width,
      height: param.height,
      minWidth: 800,
      minHeight: 600,
      // frame: false
    });
    this.load(routeName);
    this.window.on("closed", () => {
      this.window = undefined;
    });
  }

  getBound(): Rectangle {
    if (this.window) {
      return this.window.getBounds();
    } else {
      return {
        x: 100,
        y: 100,
        width: 800,
        height: 600
      };
    }
  }

  restore(param: ModeConfig) {
    if (this.window) {
      this.window.setBounds(Object.assign(this.getBound(), param));
      this.window.setAlwaysOnTop(
        (<any>global).controller.get(RuleName.stayTop)
      );
    }
  }
}

export { WindowWrapper };
