const { parentPort, workerData } = require("worker_threads");
const { spawn } = require("child_process");
new Promise((res) => {
  const { path, args, options, debug } = workerData;
  const proc = spawn(path, [].concat(args, "--use_debug=0"), options);
  proc.stdout.on("data", function stdout(chunk) {
    if (!chunk.toString().match("OCR init completed.")) return;
    proc.stdout.off("data", stdout);
    return res(proc);
  });
  if (debug) {
    proc.stdout.on("data", (chunk) => {
      console.log(chunk.toString());
    });
    proc.stderr.on("data", (data) => {
      console.log(data.toString());
    });
    proc.on("close", (code) => {
      console.log("close code: ", code);
    });
    proc.on("exit", (code) => {
      console.log("exit code: ", code);
    });
  }
}).then((proc) => {
  parentPort.postMessage({
    code: 0,
    message: "OCR init completed.",
    pid: proc.pid,
  });
  parentPort.on("message", (data) => {
    proc.stdin.write(JSON.stringify(data) + "\n");
  });
  proc.stdout.on("data", (chunk) => {
    parentPort.postMessage(JSON.parse(chunk));
  });
});
