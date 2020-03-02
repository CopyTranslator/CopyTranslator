import { desktopCapturer, screen, ipcRenderer } from "electron";
//注意，这一个函数一定要在渲染进程里调用
export function capture(x: number, y: number, width: number, height: number) {
  // 主进程捕获到截图快捷键就让渲染进程截图
  // 获取屏幕数量
  // screen为electron的模块
  const displays = screen.getAllDisplays();
  // 每个屏幕都截图一个
  // desktopCapturer.getSources可以一次获取所有桌面的截图
  // 但由于thumbnailSize不一样所以就采用了每个桌面尺寸都捕获一张
  const getDesktopCapturer = displays.map((display, i) => {
    return new Promise((resolve, reject) => {
      desktopCapturer.getSources(
        {
          types: ["screen"],
          thumbnailSize: display.size
        },
        (error, sources) => {
          if (!error) {
            return resolve({
              display,
              thumbnail: sources[i].thumbnail
            });
          }
          return reject(error);
        }
      );
    });
  });
  Promise.all(getDesktopCapturer)
    .then((sources: any) => {
      // 把数据传递到主进程
      const thumbnail = sources[0].thumbnail;
      let img = new Image();
      let canvas = document.createElement("canvas");
      let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
        canvas.getContext("2d")
      );
      img.src = thumbnail.toDataURL();
      img.addEventListener("load", () => {
        canvas.width = 500;
        canvas.height = 500;
        ctx.drawImage(img, 0, 0, 500, 500, 0, 0, 500, 500);
        const dataURL = canvas.toDataURL("image/png");
      });
      ipcRenderer.send("shortcut-capture", sources);
    })
    .catch(error => console.log(error));
}
