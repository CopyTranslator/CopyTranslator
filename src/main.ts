import Vue from "vue";

import { RendererController } from "./renderer";
const rendererController = RendererController.getInstance();
Vue.prototype.$controller = rendererController;
Vue.config.productionTip = false;
