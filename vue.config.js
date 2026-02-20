const osType = require("os").type();
const osSpec = {
  Windows_NT: { iconName: "icon.ico" },
  Darwin: { iconName: "icon.png" },
  Linux: { iconName: "icon.png" },
}[osType];
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");
const path = require("path");

const trayIconName = "tray@2x.png";

module.exports = {
  transpileDependencies: [
    "vuetify",
    "@opentranslate/google",
    "@opentranslate/baidu",
    "@opentranslate/caiyun",
    "@opentranslate2/niu",
    "@opentranslate2/youdao",
    "@opentranslate2/sogou",
    "@opentranslate2/translator",
    "@opentranslate2/baidu-domain",
    "@opentranslate2/aliyun",
    "@opentranslate2/azure",
    "@opentranslate2/deepl",
    "@opentranslate2/tencent",
    "@opentranslate2/tencent-smart",
    "@opentranslate2/volc",
    "@opentranslate2/yandex"
  ],
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      mainProcessTypeChecking: false,
      chainWebpackRendererProcess: (config) => {
        // config.when(process.env.NODE_ENV === "production", (config) => {
        //   config.plugin("analysis").use(new BundleAnalyzerPlugin());
        // });
      },
      chainWebpackMainProcess: (config) => {
        config.resolve.alias.set(
          "core-js",
          path.resolve(__dirname, "node_modules/core-js")
        );
        // 主进程也需要转译这些包
        config.module
          .rule("compile-opentranslate")
          .test(/\.js$/)
          .include
            .add(/node_modules[\\/]@opentranslate/)
            .add(/node_modules[\\/]@opentranslate2/)
            .add(/OpenTranslate[\\/]packages/)
            .end()
          .use("babel-loader")
            .loader("babel-loader")
            .options({
              presets: [
                [require.resolve("@vue/cli-plugin-babel/preset"), { targets: { node: "current" } }]
              ],
              plugins: [
                require.resolve("@babel/plugin-proposal-class-properties")
              ]
            });
        // config.when(process.env.NODE_ENV === "production", (config) => {
        //   config.plugin("analysis").use(new BundleAnalyzerPlugin());
        // });
      },
      builderOptions: {
        appId: "com.copytranslator.copytranslator",
        publish: {
          provider: "github",
          owner: "copytranslator",
          repo: "copytranslator",
        },
        asar: true,
        extraResources: [
          {
            from: `dist_locales`,
            to: `locales`,
          },
          {
            from: `external_resource`,
            to: `external_resource`,
          },
          {
            from: trayIconName,
            to: trayIconName,
          },
          {
            from: osSpec.iconName,
            to: osSpec.iconName,
          },
        ],
        win: {
          icon: osSpec.iconName,
          target: [
            {
              target: "nsis",
              arch: ["x64"],
            },
            {
              target: "zip",
              arch: ["x64"],
            },
          ],
        },
        linux: {
          target: [
            {
              target: "AppImage",
              arch: ["x64"],
            },
            {
              target: "deb",
              arch: ["x64"],
            },
            {
              target: "rpm",
              arch: ["x64"],
            },
          ],
          maintainer: "ziqiang_xu@qq.com",
          icon: osSpec.iconName,
          category: "Education",
          // https://www.electron.build/configuration/linux#debian-package-options
          desktop: {
            Icon: "/opt/copytranslator/resources/linux-icon/icon.png",
          },
        },
        deb: {
          depends: ["libpng16-16"],
        },
        rpm: {
          depends: ["libpng"],
        },
        mac: {
          target: [
            {
              target: "default",
              arch: ["x64"],
            },
          ],
          icon: osSpec.iconName,
        },
        nsis: {
          installerIcon: osSpec.iconName,
          oneClick: false,
          perMachine: false,
          allowToChangeInstallationDirectory: true,
          license: "readable_license.txt",
        },
      },
      externals: ["iohook", "shortcut-capture", "active-win","@nut-tree/nut-js"],
      // 这一步还蛮重要的，不然就会报错
      nodeModulesPath: ["./node_modules"],
    },
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin()],
    optimization: {
      usedExports: true,
    },
    resolve: {
      alias: {
        "core-js": path.resolve(__dirname, "node_modules/core-js"),
      },
    },
  },
};
