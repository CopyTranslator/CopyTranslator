import { envConfig } from "./envConfig";
var fs=require("fs");

function loadStyles(): string {
  if (!fs.existsSync(envConfig.sharedConfig.style)) {
try {
    fs.copyFileSync(
      envConfig.diffConfig.styleTemplate,
      envConfig.sharedConfig.style
    );
}catch(e){
	console.log(e);
}
  }
  try {
    let styles = fs.readFileSync(envConfig.sharedConfig.style, "utf-8");
    return styles.toString();
  } catch (e) {
    return "";
  }
}

export { loadStyles };
