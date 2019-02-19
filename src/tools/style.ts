import { envConfig } from "./envConfig";
import fs from "fs";

function loadStyles(): string {
  if (!fs.existsSync(envConfig.sharedConfig.style)) {
    fs.copyFileSync(
      envConfig.diffConfig.styleTemplate,
      envConfig.sharedConfig.style
    );
  }
  try {
    let styles = fs.readFileSync(envConfig.sharedConfig.style, "utf-8");
    return styles.toString();
  } catch (e) {
    return "";
  }
}
export { loadStyles };
