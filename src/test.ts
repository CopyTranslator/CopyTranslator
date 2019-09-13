const { exec } = require("child_process");
const path = require("path");
console.log(__dirname);
exec(
  "E:/CopyTranslator/exe/mouse_keyboard_input.exe V",
  (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  }
);
