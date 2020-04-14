const robot = require("robotjs");

function simulateCopy() {
  robot.keyTap("C", "control");
}

function simulatePaste() {
  robot.keyTap("V", "control");
}

export default {
  copy: simulateCopy,
  paste: simulatePaste
};
