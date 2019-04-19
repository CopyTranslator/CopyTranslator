import { dialog, BrowserWindow, screen, nativeImage } from "electron";
import { autoUpdater } from "electron-updater";
import { Controller } from "../core/controller";
import { envConfig } from "./envConfig";
autoUpdater.autoDownload = false;

autoUpdater.on("error", (error: Error) => {
  dialog.showErrorBox(
    "Error: ",
    error == null ? "unknown" : (error.stack || error).toString()
  );
});

autoUpdater.on("update-available", updateInfo => {
  const point = screen.getCursorScreenPoint();
  const width = 500,
    height = 500;
  let window = new BrowserWindow({
    x: point.x - width / 2,
    y: point.y - height / 2,
    width: width,
    height: height,
    titleBarStyle: "hiddenInset",
    maximizable: false,
    title: "Software Update",
    icon: nativeImage.createFromPath(envConfig.diffConfig.iconPath)
  });
  window.loadURL(`${envConfig.diffConfig.publicUrl}/dialog.html`);
  window.webContents.on("did-finish-load", function() {
    window.webContents.executeJavaScript(
      `document.getElementById("releaseNote").innerHTML="${
        updateInfo.releaseNotes
      }";document.getElementById("releaseName").innerHTML="${
        updateInfo.releaseName
      }";document.getElementById("version").innerHTML="${updateInfo.version}";`
    );
  });
});

autoUpdater.on("update-not-available", updateInfo => {
  console.log(updateInfo);
  dialog.showMessageBox({
    type: "info",
    title: "No Updates",
    message: "Current version is up-to-date.",
    icon: nativeImage.createFromPath(envConfig.diffConfig.iconPath)
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox(
    {
      type: "info",
      title: "Install Updates",
      icon: nativeImage.createFromPath(envConfig.diffConfig.iconPath),
      message: "Updates downloaded, application will be quit for update..."
    },
    () => {
      setImmediate(() => autoUpdater.quitAndInstall());
    }
  );
});

// export this to MenuItem click callback
export function checkForUpdates() {
  autoUpdater.checkForUpdates();
}
