import { ipcRenderer } from "electron";
ipcRenderer.send("what are");
import Vue from "vue";
function t(key: string) {
  return "hello";
}
Vue.prototype.$t = t;
import { RendererController } from "./renderer";
import bus from "./common/event-bus";
const rendererController = RendererController.getInstance();
Vue.prototype.$controller = rendererController;
Vue.config.productionTip = false;

(window as any).requestIdleCallback(() => {
  bus.gat("firstLoad");
});
