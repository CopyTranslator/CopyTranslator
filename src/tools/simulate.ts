const robot = require("robotjs");
const backup = "";
import os from "os";
const isMac: boolean = os.platform() == "darwin";

/*function simulateCopy() {
  // robot.keyTap("C", "control");
  robot.keyTap("C", ["control", "command"]);
}*/

function simulateCopy() {
  robot.keyTap("C", isMac ? "command" : "control");
}
function simulatePaste() {
  robot.keyTap("V", isMac ? "command" : "control");
}

/*function simulatePaste() {
  // robot.keyTap("V", "control");
  robot.keyTap("V", ["control", "command"]);
}*/

export default {
  copy: simulateCopy,
  paste: simulatePaste
};
