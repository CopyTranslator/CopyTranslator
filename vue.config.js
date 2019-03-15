const iconName =
  require("os").type() === "Windows_NT" ? "icon.ico" : "icon.png";

const trayIconName = "tray.png";

module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessTypeChecking: false,
      builderOptions: {
        asar: true,
        extraResources: [
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
            // {
            //   target: "portable",
            //   arch: ["x64"] //"ia32"
            // },
            // {
            //   target: "zip",
            //   arch: ["x64"] //"ia32"
            // }
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
              target: "dmg",
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
      externals: ["iohook"],
      // 这一步还蛮重要的，不然就会报错
      nodeModulesPath: ["./node_modules"]
    }
  }
};
