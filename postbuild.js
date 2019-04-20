const fs = require("fs");
const path = require("path");
const os = require("os");
const dist_dir = "./dist_electron";
const filePath = "./package.json";
const file = fs.readFileSync(filePath, "utf8");
const packagejson = JSON.parse(file);
const source = `copytranslator Setup ${packagejson.version}.exe`;
const target = `copytranslator-setup-${packagejson.version}.exe`;

fs.renameSync(path.join(dist_dir, source), path.join(dist_dir, target));
fs.renameSync(
  path.join(dist_dir, source + ".blockmap"),
  path.join(dist_dir, target + ".blockmap")
);
