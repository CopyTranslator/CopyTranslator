import { osType } from "@/common/env";
const { keyboard, Key } = require("@nut-tree/nut-js");
const ctrl = osType == "Darwin" ? Key.LeftSuper : Key.LeftControl;

async function simulateCopy() {
  await keyboard.pressKey(ctrl, Key.C);
  await keyboard.releaseKey(ctrl, Key.C);
}

async function simulatePaste() {
  await keyboard.pressKey(Key.LeftSuper, Key.V);
  await keyboard.releaseKey(Key.LeftSuper, Key.V);
}

export default {
  copy: simulateCopy,
  paste: simulatePaste,
};
