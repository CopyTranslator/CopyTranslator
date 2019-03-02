const iconName =
  require("os").type() === "Windows_NT" ? "icon.ico" : "icon.png";

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
            from: iconName,
            to: iconName
          },
          {
            from: `src/styles.css`,
            to: `styles.css`
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
