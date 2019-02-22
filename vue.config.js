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
            from: `icon.png`,
            to: `icon.png`
          },
          {
            from: `src/styles.css`,
            to: `styles.css`
          }
        ],
        linux: {
          target: [
            {
              target: "deb",
              arch: ["x64"]
            }
          ]
        }
      },
      externals: ["iohook"],
      // 这一步还蛮重要的，不然就会报错
      nodeModulesPath: ["./node_modules"]
    }
  }
};
