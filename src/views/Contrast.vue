<template>
  <div>
    <v-app v-bind:style="[appStyle, transparency]">
      <v-dialog v-model="dialog">
        <Tips></Tips>
      </v-dialog>
      <v-app-bar
        app
        :color="barColor"
        dark
        dense
        :height="titlebarHeight"
        :flat="config.penerate"
      >
        <ActionButton
          v-if="!config.penerate"
          left_click="drawer"
          right_click="settings"
          icon="mdi-menu"
        ></ActionButton>
        <div class="noSelect" style="overflow: hidden;">
          <p
            style="margin-top: auto; margin-bottom: auto; white-space: nowrap;"
            class="hidden-mobile"
            v-if="!isMini"
          >
            {{ trans[layoutType] }}
          </p>
        </div>
        <v-spacer
          style="height: calc(100% - 1px); padding-top: 1px;"
          @mouseover="penerate(true)"
          @mouseleave="penerate(false)"
        >
          <div :class="{ dragableDiv: !config.penerate }"></div>
        </v-spacer>
        <v-menu top>
          <template v-slot:activator="{ on }">
            <div
              style="display: flex;"
              v-on="on"
              @contextmenu="callback('listenClipboard')"
            >
              <v-badge
                dot
                :color="badgeColor"
                offset-y="pl/ml-5"
                offset-x="pl/ml-1"
                style="margin: auto;"
              >
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
                  :style="engineButtonStyle"
                >
                  <EngineButton :engine="engine" :valid="valid"></EngineButton>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-menu>
        <div class="d-flex flex-row" style="height: 100%; padding-right: 1px;">
          <div
            v-if="config.penerate"
            class="dragableDiv"
            style="display: flex;"
          >
            <ActionButton
              icon="mdi-cursor-move"
              style="margin: auto;"
            ></ActionButton>
          </div>
          <ActionButton
            v-if="config.penerate"
            left_click="drawer"
            right_click="settings"
            icon="mdi-menu"
          ></ActionButton>
          <ActionButton
            class="action-btn"
            v-for="(actionButton, buttonIndex) in actionButtons"
            :left_click="actionButton.left_click"
            :right_click="actionButton.right_click"
            :icon="actionButton.icon"
            :tooltip="actionButton.tooltip"
            :predefined="actionButton.predefined"
            :key="buttonIndex"
          ></ActionButton>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
        :style="drawerStyle"
      >
        <Action
          v-for="actionId in actionKeys"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </v-navigation-drawer>

      <ContrastPanel
        :style="[area, transparentArea]"
        v-bind:class="{ active: drawer }"
        @mouseover.native="penerate(true)"
        @mouseleave.native="penerate(false)"
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
  hexToRgb,
  colorStatusMap,
} from "../common/types";
import EngineButton from "../components/EngineButton.vue";

import { dictionaryTypes, DictionaryType } from "../common/dictionary/types";
import "@/css/shared-styles.css";

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
  marginBottom: number = 5;

  get valid() {
    return (
      this.mode == "dict" &&
      (this.config.contrastDict || this.layoutType === "focus")
    );
  }

  penerate(value: boolean) {
    if (this.config.penerate) {
      //穿透，那就根据鼠标的情况进行设置
      this.set("ignoreMouseEvents", value);
    } else if (this.config.ignoreMouseEvents) {
      //不穿透,但是此时却说要ignore，这就不对，要更新值
      this.set("ignoreMouseEvents", false);
    }
  }

  get isMini() {
    return this.config.transparency > 0;
  }

  mounted() {
    this.dialog = true;
  }

  get nButton() {
    return Math.max(
      1,
      Math.floor(
        (this.windowHeight - this.titlebarHeightVal) /
          (this.titlebarHeightVal + this.marginBottom)
      )
    );
  }

  get engines(): Array<GeneralTranslatorType | DictionaryType> {
    const translatorEngines: GeneralTranslatorType[] = [
      ...this.config["translator-enabled"],
      ...abstractTranslatorTypes,
    ];
    return this.mode == "dict" ? [...dictionaryTypes] : translatorEngines;
  }

  get restEngines() {
    return this.engines.filter((engine: any) => engine != this.currentEngine);
  }

  get restEngineGroups() {
    return sliceArray(this.restEngines, this.nButton);
  }

  get engineButtonStyle() {
    return { "margin-bottom": `${this.marginBottom}px` };
  }

  get popupStyle() {
    const width = (this.titlebarHeightVal + 10) * this.restEngineGroups.length;
    const margin = this.titlebarHeightVal / 2 + 5;
    return { width: `${width}px`, "margin-top": `${margin}px` };
  }

  get actionButtons(): ActionButtonType[] {
    return this.config.actionButtons;
  }

  get badgeColor() {
    return colorStatusMap.get(this.status);
  }

  get barWidth(): number {
    return this.drawer ? 200 : 0;
  }

  get area() {
    return {
      "margin-top": this.titlebarHeight,
      width: `calc(100vw - ${this.barWidth.toString()}px)`,
      "font-family": this.config.contentFontFamily,
    };
  }

  get transparentArea() {
    return {
      "border-width": "0px 1px 1px 1px",
      "border-style": "solid",
      "border-color": this.barColor,
    };
  }

  get drawerStyle() {
    return {
      "border-width": "1px 0px 1px 1px",
      "border-style": "solid",
      "border-color": this.barColor,
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

  get backgroundColor() {
    const alpha = 1 - this.config.transparency; //不透明度
    const bgColor = this.$vuetify.theme.dark
      ? this.config.backgroundColor.dark
      : this.config.backgroundColor.light;
    const rgb = hexToRgb(bgColor as string);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  }

  get barColor() {
    const alpha = 1 - this.config.transparency; //不透明度
    const bgColor = this.$vuetify.theme.currentTheme.primary;
    const rgb = hexToRgb(bgColor as string);
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  }

  get transparency() {
    return {
      background: this.backgroundColor,
    };
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
  padding-top: 5px;
  text-align: center;
}

.action-btn {
  margin: auto;
}
</style>
