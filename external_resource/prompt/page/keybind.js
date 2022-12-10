/* HTML style of KeybindGetter

  <label class="keybindLabel">Example</label>
  <input readonly type="text" class="keybindData">
  <button class="clearButton">Clear</button>

*/
const { promptError } = require("./prompt");

class KeybindGetter {
  /* Attributes:
    modifiers: Set<string>
    key: string
    value: string
    label: labelElement
    input: inputElement
    clearButton: buttonElement
    */

  constructor(options, parentElement) {
    if (!options.label || !options.value) {
      promptError("keybind option must contain label and value");
      return;
    }

    this.key = "";
    this.modifiers = new Set();

    this.value = options.value;

    this.label = document.createElement("label");
    this.label.classList.add("keybindLabel");

    this.input = document.createElement("input");
    this.input.setAttribute("readonly", true);
    this.input.classList.add("keybindData");

    this.clearButton = document.createElement("button");
    this.clearButton.classList.add("clearButton");
    this.clearButton.textContent = "Clear";

    parentElement.append(this.label, this.input, this.clearButton);

    this.setup(options);

    if (options.default) {
      this.setDefault(options.default);
    }
  }

  focus() {
    this.input.focus();
  }

  output() {
    const output = {
      value: this.value,
      accelerator: this.input.value.replaceAll(" ", ""),
    };
    return JSON.stringify(output);
  }

  updateText() {
    let result = "";
    for (const modifier of this.modifiers) {
      result += modifier + " + ";
    }

    this.input.value = result + this.key;
  }

  setDefault(defaultValue) {
    const accelerator = parseAccelerator(defaultValue).split("+");
    for (const key of accelerator) {
      if (isModifier(key)) {
        this.modifiers.add(key);
      } else {
        this.key = key;
      }
    }

    this.updateText();
  }

  clear() {
    this.modifiers.clear();
    this.key = "";
    this.input.value = "";
  }

  setup(options) {
    this.input.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.repeat) {
        return;
      }

      let key = event.code || event.key;
      if (key in virtualKeyCodes) {
        key = virtualKeyCodes[event.code];
      } else {
        console.log('Error, key "' + event.code + '" was not found');
        return;
      }

      if (isModifier(key)) {
        if (this.modifiers.size < 3) {
          this.modifiers.add(key);
        }
      } else {
        // Is key
        this.key = key;
      }

      this.updateText();
    });

    this.clearButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.clear();
    });

    this.label.textContent = options.label + " ";
  }
}

class KeybindContainer {
  // Elements: KeybindGetter[];

  constructor(options, parentElement) {
    parentElement.classList.add("keybind");
    this.elements = options.map(
      (option) => new KeybindGetter(option, parentElement)
    );
    document.querySelector("#buttons").style["padding-top"] = "20px";
  }

  focus() {
    if (this.elements.length > 0) {
      this.elements[0].focus();
    }
  }

  submit() {
    return this.elements.map((element) => element.output());
  }
}

function parseAccelerator(a) {
  let accelerator = a.toString();

  accelerator =
    process.platform === "darwin"
      ? accelerator.replace(/(ctrl)|(control)/gi, "")
      : accelerator.replace(/(cmd)|(command)/gi, "");

  return accelerator.replace(/(or)/gi, "");
}

function isModifier(key) {
  for (const modifier of [
    "Shift",
    "Control",
    "Ctrl",
    "Command",
    "Cmd",
    "Alt",
    "AltGr",
    "Super",
  ]) {
    if (key === modifier) {
      return true;
    }
  }

  return false;
}

const virtualKeyCodes = {
  ShiftLeft: "Shift",
  ShiftRight: "Shift",
  ControlLeft: "Ctrl",
  ControlRight: "Ctrl",
  AltLeft: "Alt",
  AltRight: "Alt",
  MetaLeft: "Super",
  MetaRight: "Super",
  NumLock: "NumLock",
  NumpadDivide: "NumDiv",
  NumpadMultiply: "NumMult",
  NumpadSubtract: "NumSub",
  NumpadAdd: "NumAdd",
  NumpadDecimal: "NumDec ",
  Numpad0: "Num0",
  Numpad1: "Num1",
  Numpad2: "Num2",
  Numpad3: "Num3",
  Numpad4: "Num4",
  Numpad5: "Num5",
  Numpad6: "Num6",
  Numpad7: "Num7",
  Numpad8: "Num8",
  Numpad9: "Num9",
  Digit0: "0",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  Minus: "-",
  Equal: "=",
  KeyQ: "Q",
  KeyW: "W",
  KeyE: "E",
  KeyR: "R",
  KeyT: "T",
  KeyY: "Y",
  KeyU: "U",
  KeyI: "I",
  KeyO: "O",
  KeyP: "P",
  KeyA: "A",
  KeyS: "S",
  KeyD: "D",
  KeyF: "F",
  KeyG: "G",
  KeyH: "H",
  KeyJ: "J",
  KeyK: "K",
  KeyL: "L",
  KeyZ: "Z",
  KeyX: "X",
  KeyC: "C",
  KeyV: "V",
  KeyB: "B",
  KeyN: "N",
  KeyM: "M",
  BracketLeft: "[",
  BracketRight: "]",
  Semicolon: ";",
  Quote: "'",
  Backquote: "`",
  Backslash: "\\",
  Comma: ",",
  Period: "'.'",
  Slash: "/",
  Plus: "+",
  Space: "Space",
  Tab: "Tab",
  Backspace: "Backspace",
  Delete: "Delete",
  Insert: "Insert",
  Return: "Return",
  Enter: "Enter",
  ArrowUp: "Up",
  ArrowDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Escape: "Escape",
  AudioVolumeUp: "VolumeUp",
  AudioVolumeDown: "VolumeDown",
  AudioVolumeMute: "VolumeMute",
  MediaTrackNext: "MediaNextTrack",
  MediaTrackPrevious: "MediaPreviousTrack",
  MediaStop: "MediaStop",
  MediaPlayPause: "MediaPlayPause",
  ScrollLock: "ScrollLock",
  PrintScreen: "PrintScreen",
  F1: "F1",
  F2: "F2",
  F3: "F3",
  F4: "F4",
  F5: "F5",
  F6: "F6",
  F7: "F7",
  F8: "F8",
  F9: "F9",
  F10: "F10",
  F11: "F11",
  F12: "F12",
  F13: "F13",
  F14: "F14",
  F15: "F15",
  F16: "F16",
  F17: "F17",
  F18: "F18",
  F19: "F19",
  F20: "F20",
  F21: "F21",
  F22: "F22",
  F23: "F23",
  F24: "F24",
};

module.exports = (options, parentElement) => {
  return new KeybindContainer(options, parentElement);
};
