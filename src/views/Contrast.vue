<template>
  <div>
    <v-app v-bind:style="appStyle">
      <v-dialog v-model="dialog">
        <Tips></Tips>
      </v-dialog>
      <v-app-bar app color="primary" dark dense height="40px">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="noSelect">
          <p style="margin: auto;" class="hidden-mobile">
            {{ trans[layoutType] }}
          </p>
        </div>
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
          <v-card :style="popupStyle" class="popup">
            <v-row style="margin: 0px;">
              <v-col
                v-for="(engineGroup, groupIndex) in restEngineGroups"
                :key="groupIndex"
                style="padding: 0px;"
              >
                <div
                  v-for="engine in engineGroup"
                  :key="engine"
                  style="margin-bottom: 8px;"
                >
                  <EngineButton :engine="engine" :valid="valid"></EngineButton>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-menu>
        <ActionButton
          v-for="(actionButton, buttonIndex) in actionButtons"
          :left_click="actionButton.left_click"
          :right_click="actionButton.right_click"
          :icon="actionButton.icon"
          :tooltip="actionButton.tooltip"
          :predefined="actionButton.predefined"
          :key="buttonIndex"
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
import Tips from "@/components/Tips.vue";
import {
  Identifier,
  ActionButton as ActionButtonType,
  abstractTranslatorTypes,
  GeneralTranslatorType,
} from "../common/types";
import EngineButton from "../components/EngineButton.vue";

import {
  dictionaryTypes,
  DictionaryType,
  emptyDictResult,
} from "../common/dictionary/types";

function sliceArray<T>(arr: T[], size: number) {
  var arr2 = [];
  for (var i = 0; i < arr.length; i = i + size) {
    arr2.push(arr.slice(i, i + size));
  }
  return arr2;
}

@Component({
  components: {
    Action,
    ContrastPanel,
    EngineButton,
    ActionButton,
    Tips,
  },
})
export default class Contrast extends Mixins(BaseView, WindowController) {
  readonly routeName = "contrast";
  actionKeys: Identifier[] = this.$controller.action.getKeys(
    "contrastPanel"
  ) as Identifier[];

  dialog: boolean = false;

  mounted() {
    this.dialog = this.config.isNewUser;
  }

  get nButton() {
    return Math.floor((this.windowHeight - 40) / 40);
  }

  get engines(): Array<GeneralTranslatorType | DictionaryType> {
    const translatorEngines: GeneralTranslatorType[] = [
      ...this.config["translator-enabled"],
      ...abstractTranslatorTypes,
    ];
    return this.valid ? [...dictionaryTypes] : translatorEngines;
  }

  get restEngines() {
    return this.engines.filter((engine: any) => engine != this.currentEngine);
  }

  get restEngineGroups() {
    return sliceArray(this.restEngines, this.nButton);
  }

  get popupStyle() {
    const width = 55 * this.restEngineGroups.length;
    return { width: `${width}px` };
  }

  get actionButtons(): ActionButtonType[] {
    return this.config.actionButtons;
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
      "font-family": this.config.contentFontFamily,
    };
  }

  get drawer(): boolean {
    return this.config.drawer;
  }

  set drawer(val: boolean) {
    this.set("drawer", val);
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

.noPad {
  padding: 0px;
}

::-webkit-scrollbar {
  display: none;
}

.noSelect {
  user-select: none;
  display: flex;
  -webkit-app-region: drag;
}

.popup {
  margin-top: 30px;
  padding-top: 5px;
  text-align: center;
}
</style>
