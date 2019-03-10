"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var locales_1 = require("./tools/locales");
var localeDir = path.join(process.cwd(), "dist_locales");
function mkdir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}
function generateLocales(locales, localeDir) {
    mkdir(localeDir);
    for (var key in locales) {
        fs.writeFileSync(path.join(localeDir, key + ".json"), JSON.stringify(locales[key], null, 4));
    }
}
// prettier-ignore
var resources = {
    'en': locales_1.en,
    'zh-cn': locales_1.zh_cn
};
fs.readdirSync(localeDir)
    .filter(function (e) { return !_.includes(Object.keys(resources), e.replace(".json", "")); })
    .forEach(function (fileName) {
    var name = fileName.replace(".json", "");
    var locale = JSON.parse(fs.readFileSync(path.join(localeDir, fileName)));
    for (var key in locales_1.en) {
        locale[key] = locale[key] ? locale[key] : locales_1.en[key];
    }
    resources[name] = locale;
});
generateLocales(resources, localeDir);
