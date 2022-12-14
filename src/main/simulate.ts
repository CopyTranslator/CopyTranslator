import { osType } from "@/common/env";
const { keyboard, Key } = require("@nut-tree/nut-js");
const modifier = osType == "Darwin" ? Key.LeftSuper : Key.LeftControl;

async function simulateCopy() {
  await keyboard.pressKey(modifier, Key.C);
  await keyboard.releaseKey(modifier, Key.C);
}

async function simulatePaste() {
  await keyboard.pressKey(modifier, Key.V);
  await keyboard.releaseKey(modifier, Key.V);
}

export default {
  copy: simulateCopy,
  paste: simulatePaste,
};
