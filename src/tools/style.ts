import { env } from "./env";

var fs = require("fs");

const defaultStyles = `
.application{ /*在这里设置整个应用的字体*/
    font-family: "微软雅黑","PingHei";
}

.focusText {
    /*modify the style of the focus result textarea*/
    /*font-family: Monaco;*/ /*设置专注模式的字体为 Monaco*/
}

.contrastText {
    /*modify the style of the contrast src and result textarea*/

}

.contrast {
    /*modify the style of the contrast mode panel*/
}
`;

let loadedStyles: undefined | string;

function loadStyles(): string {
  if (loadedStyles) {
    return loadedStyles;
  }
  try {
    loadedStyles = <string>fs.readFileSync(env.style, "utf-8").toString();
    return loadedStyles;
  } catch (e) {
    fs.writeFileSync(env.style, defaultStyles);
    loadedStyles = defaultStyles;
    return defaultStyles;
  }
}

export { loadStyles };
