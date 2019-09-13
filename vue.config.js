const is_win = require("os").type() === "Windows_NT";
const iconName = is_win ? "icon.ico" : "icon.png";

const trayIconName = "tray@2x.png";

module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessTypeChecking: false,
      builderOptions: {
        appId: "com.copytranslator.copytranslator",
        asar: true,
        extraResources: is_win
          ? [
              {
                from: `dist_locales`,
                to: `locales`
              },
              {
                from: `exe`,
                to: `exe`
              },
              {
                from: trayIconName,
                to: trayIconName
              },
              {
                from: iconName,
                to: iconName
              }
            ]
          : [
              {
                from: `dist_locales`,
                to: `locales`
              },
              {
                from: trayIconName,
                to: trayIconName
              },
              {
                from: iconName,
                to: iconName
              }
            ],
        win: {
          icon: iconName,
          target: [
            {
              target: "nsis",
              arch: ["x64"] //"ia32"
            }
          ]
        },
        linux: {
          target: [
            {
              target: "deb",
              arch: ["x64"]
            }
          ],
          icon: iconName
        },
        mac: {
          target: [
            {
              target: "default",
              arch: ["x64"]
            }
          ],
          icon: iconName
        },
        nsis: {
          installerIcon: iconName,
          oneClick: false,
          perMachine: false
        }
      },
      externals: ["iohook", "shortcut-capture"],
      // 这一步还蛮重要的，不然就会报错
      nodeModulesPath: ["./node_modules"]
    }
  }
};
