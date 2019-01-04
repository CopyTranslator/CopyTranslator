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
              arch: ["ia32"]
            }
          ]
        }
      }
    }
  }
};
