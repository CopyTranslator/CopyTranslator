<template>
  <div>
    <v-app>
      <v-app-bar app color="primary" dark dense height="40px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="hidden-mobile">{{ trans[layoutType] }}</div>
        <v-spacer style="height: 100%;">
          <div class="dragableDiv"></div>
        </v-spacer>
        <v-menu top>
          <template v-slot:activator="{ on }">
            <div v-on="on" @contextmenu="callback('listenClipboard')">
              <v-badge dot :color="color" offset-y="pl/ml-5" offset-x="pl/ml-1">
                <EngineButton
                  :engine="currentEngine"
                  :valid="valid"
                  :enable="false"
                  :tooltip="trans['engineButton']"
                ></EngineButton>
              </v-badge>
            </div>
          </template>

          <v-list>
            <v-list-item v-for="engine in rest_engines" :key="engine">
              <EngineButton :engine="engine" :valid="valid"></EngineButton>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- 添加事件监听器时使用事件捕获模式 -->
        <!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
        <ActionButton
          @click="enumerateLayouts"
          icon="mdi-view-quilt"
          tooltip="layoutButton"
        ></ActionButton>
        <ActionButton
          left_click="copyResult"
          right_click="copySource"
          icon="mdi-content-copy"
          tooltip="copyButton"
        ></ActionButton>
        <ActionButton
          left_click="minimize"
          right_click="closeWindow"
          icon="mdi-window-minimize"
          tooltip="closeButton"
        ></ActionButton>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
      >
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </v-navigation-drawer>

      <ContrastPanel
        :style="area"
        v-bind:class="{ active: drawer }"
      ></ContrastPanel>
    </v-app>
  </div>
</template>

<script lang="ts">
import ActionButton from "../components/ActionButton.vue";
import ContrastPanel from "../components/ContrastPanel.vue";
import BaseView from "../components/BaseView.vue";
import WindowController from "../components/WindowController.vue";
import Action from "../components/Action.vue";
import Component from "vue-class-component";
import { Mixins } from "vue-property-decorator";
import {
  Identifier,
  layoutTypes,
  abstractTranslatorTypes,
  GeneralTranslatorType,
} from "../common/types";
import EngineButton from "../components/EngineButton.vue";

import {
  dictionaryTypes,
  DictionaryType,
  emptyDictResult,
} from "../common/dictionary/types";

@Component({
  components: {
    Action,
    ContrastPanel,
    EngineButton,
    ActionButton,
  },
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  readonly routeName = "contrast";
  actionKeys: Identifier[] = this.$controller.action.getKeys(
    "contrastPanel"
  ) as Identifier[];

  get engines(): Array<GeneralTranslatorType | DictionaryType> {
    const translatorEngines: GeneralTranslatorType[] = [
      ...this.config["translator-enabled"],
      ...abstractTranslatorTypes,
    ];
    return this.valid ? [...dictionaryTypes] : translatorEngines;
  }

  get rest_engines() {
    return this.engines.filter((engine: any) => engine != this.currentEngine);
  }

  get styleNow() {
    return `background:${this.color};`;
  }

  get color() {
    return this.$store.state.color;
  }

  get barWidth(): number {
    return this.drawer ? 200 : 0;
  }

  get area() {
    return {
      "margin-top": "40px",
      width: `${(this.windowWidth - this.barWidth).toString()}px`,
    };
  }

  get drawer(): boolean {
    return this.config.drawer;
  }

  set drawer(val: boolean) {
    this.set("drawer", val);
  }

  enumerateLayouts() {
    const index = layoutTypes.findIndex((x) => x === this.layoutType);
    this.set("layoutType", layoutTypes[(index + 1) % layoutTypes.length]);
  }

  get layoutType() {
    return this.config.layoutType;
  }
}
</script>
<style>
.active {
  margin-left: 200px;
}

@media (max-width: 300px) {
  .hidden-mobile {
    display: none;
  }
}

.dragableDiv {
  -webkit-app-region: drag;
  height: 100%;
  width: 100%;
}
.ctrlBtn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 300px;
}
.btnBase {
  background-position: center;
  background-size: contain;
}
.noPad {
  padding: 0px;
}
.copyBtn {
  background-image: url("../images/copy.png");
}
.switchBtn {
  background-image: url("../images/switch.png");
}
</style>
