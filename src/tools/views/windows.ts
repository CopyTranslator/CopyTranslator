import {
  app,
  BrowserWindow,
  Rectangle,
  screen,
  nativeImage,
  TouchBarSlider,
  Menu
} from "electron";
import { ColorStatus, HideDirection, MessageType, WinOpt } from "../enums";
import { ModeConfig } from "../rule";
import { env } from "../env";
import { RouteName } from "../action";
import { Controller } from "../../core/controller";
import { loadRoute, insertStyles } from ".";

export class WindowWrapper {
  window: BrowserWindow | undefined = undefined;
  stored: string = "Focus";

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
      (<Controller>(<any>global).controller).set("frameMode", routeName);
    }
  }

  load(routerName: RouteName = "Focus") {
    if (!this.window) return;
    this.winOpt(WinOpt.SaveMode);
    loadRoute(this.window, routerName, true);
    insertStyles(this.window);
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
    if (!(<Controller>(<any>global).controller).get("autoHide")) {
      return "None";
    }
    let { x, y, width } = this.getBound();
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      this.getBound()
    ).bounds;
    x -= xBound;
    let xEnd = x + width;

    if (x <= 0) return "Left";
    if (xEnd >= screenWidth) {
      return "Right";
    }
    if (y <= 0) return "Up";
    return "None";
  }

  edgeHide(hideDirection: HideDirection) {
    const bound = this.getBound();
    let { x, y, width, height } = bound;
    const { x: xBound, width: screenWidth } = screen.getDisplayMatching(
      bound
    ).bounds;
    let xEnd = x + width;
    let yEnd = y + height;
    switch (hideDirection) {
      case "Up":
        if (yEnd > 10) {
          y -= yEnd - 10;
          yEnd -= yEnd - 10;
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Left":
        if (xEnd > xBound + 10) {
          x -= xEnd - (xBound + 10);
          xEnd -= xEnd - (xBound + 10);
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Right":
        if (x < xBound + screenWidth - 10) {
          x += xBound + screenWidth - 10 - x;
          this.setBounds({ x: x, y: y, width: width, height: height });
        }
        break;
      case "Minify":
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
    if (x < xBound) {
      const val = xBound - x;
      x += val;
      xEnd += val;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }

    if (xEnd > xBound + screenWidth) {
      const val = xEnd - (xBound + screenWidth);
      x -= val;
      xEnd -= val;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }

    if (y < 0) {
      yEnd = y;
      y = 0;
      this.setBounds({ x: x, y: y, width: width, height: height });
    }
  }

  show(focus = true) {
    if (this.window) {
      if (this.window.isMinimized()) this.window.restore();
      // if (focus) this.window.focus();
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
    const controller = <Controller>(<any>global).controller;
    switch (routeName) {
      case "Focus":
        param = controller.get("focus");
        break;
      case "Contrast":
        param = controller.get("contrast");
        break;
      case "Settings":
        param = controller.get("settingsConfig");
        break;
      default:
        break;
    }
    if (!param) return;
    // Create the browser window.
    this.window = new BrowserWindow({
      x: param.x,
      y: param.y,
      autoHideMenuBar: true,
      width: param.width,
      height: param.height,
      icon: nativeImage.createFromPath(env.iconPath)
    });
    this.load(routeName);
    this.window.on("closed", () => {
      this.window = undefined;
    });
    this.setSkipTaskbar(controller.get("skipTaskbar"));
  }

  setSkipTaskbar(value: boolean) {
    if (this.window) {
      this.window.setSkipTaskbar(value);
    }
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
        (<Controller>(<any>global).controller).get("stayTop")
      );
    }
  }
}
