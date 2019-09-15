const osType = require("os").type();
const osSpec = {
  Windows_NT: { iconName: "icon.ico", extDir: "exe" },
  Darwin: { iconName: "icon.png", extDir: "scripts" },
  Linux: { iconName: "icon.png" }
}[osType];

const trayIconName = "tray@2x.png";

module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessTypeChecking: false,
      builderOptions: {
        appId: "com.copytranslator.copytranslator",
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
            from: osSpec.iconName,
            to: osSpec.iconName
          },
          {
            from: osSpec.extDir,
            to: osSpec.extDir
          }
        ],
        win: {
          icon: osSpec.iconName,
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
          icon: osSpec.iconName
        },
        mac: {
          target: [
            {
              target: "default",
              arch: ["x64"]
            }
          ],
          icon: osSpec.iconName
        },
        nsis: {
          installerIcon: osSpec.iconName,
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
