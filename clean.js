const path = require("path");
const fs = require("fs");
function walk(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    var stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      // 过滤后缀名（可按你需求进行新增）
      if (path.extname(file) === ".js") {
        results.push(path.resolve(__dirname, file));
      }
    }
  });
  return results;
}

walk(path.join(__dirname, "src")).forEach(file => fs.unlinkSync(file));
