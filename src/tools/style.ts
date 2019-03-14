import { envConfig } from "./envConfig";

var fs = require("fs");

function loadStyles(): string {
  const defaultStyles = `
.focusText {
    /*modify the style of the focus result textarea*/
    font-family: Monaco; /*设置专注模式的字体为 Monaco*/
}

.contrastText {
    /*modify the style of the contrast src and result textarea*/

}

.contrast {
    /*modify the style of the contrast mode panel*/
}

.statusBar {

}
`;
  try {
    let styles = fs.readFileSync(envConfig.sharedConfig.style, "utf-8");
    return styles.toString();
  } catch (e) {
    fs.writeFileSync(envConfig.sharedConfig.style, defaultStyles);
    return defaultStyles;
  }
}

export { loadStyles };
