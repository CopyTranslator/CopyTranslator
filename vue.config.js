module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        asar: false,
        win: {
          icon: "icon.ico",
          target: [
            {
              target: "nsis",
              arch: ["ia32", "x64"]
            }
          ]
        },
        nsis: {
          installerIcon: "icon.ico",
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
