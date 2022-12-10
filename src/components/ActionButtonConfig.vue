<template>
  <div style="height: 100%;">
    <Action identifier="actionSortPrompt"></Action>
    <v-expansion-panels style="height: 100%;">
      <draggable v-model="buttons" style="width: 100%;" :disabled="!drag">
        <v-expansion-panel v-for="(button, index) in buttons" :key="index">
          <v-expansion-panel-header style="text-align: left;">
            <div style="display: flex;">
              <v-icon style="margin-top: auto; margin-bottom: auto;">{{
                button.icon
              }}</v-icon>
              <p
                style="margin-top: auto; margin-bottom: auto; margin-left: 5px;"
              >
                {{ tooltipText(button) }}
              </p>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div @mouseover="drag = false" @mouseleave="drag = true">
              <div style="text-align: center;">
                <SimpleButton @click="toSelectIcon">
                  {{ trans["chooseIconPrompt"] }}
                </SimpleButton>
              </div>
              <v-text-field
                v-model="button.icon"
                @change="update()"
                label="icon"
              ></v-text-field>
              <v-select
                v-model="button.left_click"
                @change="update()"
                label="left_click"
                :items="actionCandidates"
              ></v-select>
              <v-select
                v-model="button.right_click"
                label="right_click"
                :items="actionCandidates"
                @change="update()"
              ></v-select>
              <v-text-field
                v-model="button.tooltip"
                @change="update()"
                label="tooltip"
              ></v-text-field>
              <div style="text-align: center;">
                <SimpleButton @click="remove(index)">{{
                  trans["delete"]
                }}</SimpleButton>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div style="text-align: center;">
          <SimpleButton slot="footer" style="width: 100%;" @click="add">{{
            trans["addNewActionButton"]
          }}</SimpleButton>
          <SimpleButton style="width: 100%;" @click="restore">{{
            trans["restoreMultiDefault"]
          }}</SimpleButton>
        </div>
      </draggable>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { ActionButton } from "../common/types";
import { Component } from "vue-property-decorator";
import draggable from "vuedraggable";
import { shell } from "electron";
import Base from "./Base.vue";
import SimpleButton from "./SimpleButton.vue";
import Action from "./Action.vue";

interface Option {
  value: string;
  text: string;
}

@Component({
  components: {
    draggable,
    SimpleButton,
    Action,
  },
})
export default class ActionButtonConfig extends Base {
  actionCandidates: Option[] = [];
  drag: boolean = true;

  getActionName(name: string) {
    if (this.trans[name]) {
      return this.trans[name];
    } else {
      return name;
    }
  }

  tooltipText(actionButton: ActionButton): undefined | string {
    if (actionButton.tooltip == undefined) {
      let descs = [];
      if (actionButton.left_click != undefined) {
        descs.push(
          `${this.trans["left_click"]}${this.getActionName(
            actionButton.left_click
          )}`
        );
      }
      if (actionButton.right_click != undefined) {
        descs.push(
          `${this.trans["right_click"]}${this.getActionName(
            actionButton.right_click
          )}`
        );
      }
      return descs.join("|");
    } else {
      if (this.trans[actionButton.tooltip] != undefined) {
        return this.trans[actionButton.tooltip];
      } else {
        return actionButton.tooltip;
      }
    }
  }

  mounted() {
    this.actionCandidates = [
      ...this.$controller.action.getKeys("allActions"),
    ].map((x) => {
      return { value: x, text: this.getText(x) };
    });
  }

  getText(identifier: string) {
    if (this.trans[identifier]) {
      return this.trans[identifier];
    } else {
      return identifier;
    }
  }

  toSelectIcon() {
    shell.openExternal(
      "https://vuetifyjs.com/zh-Hans/features/icon-fonts/#material-design56fe6807"
    );
  }

  get buttons(): ActionButton[] {
    return this.$store.state.config.actionButtons;
  }

  set buttons(newButtons: ActionButton[]) {
    this.callback("actionButtons", newButtons);
  }

  update() {
    this.callback("actionButtons", this.buttons);
  }

  add() {
    this.buttons.push({});
    this.update();
  }

  remove(index: number) {
    this.buttons.splice(index, 1);
    this.update();
  }

  restore() {
    this.callback("restoreDefault", "actionButtons");
  }
}
</script>

<style scoped></style>
