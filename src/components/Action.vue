<template>
  <div>
    <v-tooltip v-if="action" bottom open-delay="100" :disabled="!tooltip">
      <template v-slot:activator="{ on, attrs }">
        <div class="actionStyle" v-bind="attrs" v-on="on">
          <v-switch
            v-if="action.actionType === 'checkbox'"
            v-model="value"
            class="myswitch"
            :label="trans[action.id]"
          ></v-switch>
          <v-dialog
            v-else-if="action.id === 'newConfigSnapshot'"
            v-model="dialog"
          >
            <template v-slot:activator="{ on, attrs }">
              <SimpleButton v-bind="attrs" v-on="on">
                {{ trans[identifier] }}
              </SimpleButton>
            </template>
            <v-card>
              <v-text-field
                class="mytext"
                v-model="text"
                :rules="rules"
                :label="trans['snapshotPrompt']"
              ></v-text-field>
              <SimpleButton
                @click="
                  callback(identifier, text);
                  dialog = false;
                  text = '';
                "
                :disabled="invalidSnapshotName"
                >{{ trans[identifier] }}
              </SimpleButton>
            </v-card>
          </v-dialog>
          <v-menu offset-y v-else-if="action.actionType === 'param_normal'">
            <template v-slot:activator="{ on, attrs }">
              <SimpleButton v-bind="attrs" v-on="on">
                {{ trans[action.id] }}
              </SimpleButton>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in action.submenu"
                :key="index"
                @click="callback(item.id)"
              >
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-dialog v-else-if="action.actionType == 'color_picker'">
            <template v-slot:activator="{ on, attrs }">
              <SimpleButton v-bind="attrs" v-on="on">
                {{ trans[action.id] }}
              </SimpleButton>
            </template>
            <v-color-picker
              v-model="color"
              flat
              :swatches="swatches"
              show-swatches
              style="margin: 10px auto;"
            ></v-color-picker>
          </v-dialog>
          <p
            v-else-if="action.actionType === 'prompt'"
            style="text-align: left; font-weight: bold;"
            class="pStyle"
          >
            {{ trans[action.id] }}
          </p>
          <MultiSelect
            v-else-if="action.actionType === 'multi_select'"
            :identifier="action.id"
          ></MultiSelect>
          <div v-else-if="action.actionType === 'constant'">
            <p class="pStyle">{{ trans[identifier] }}</p>
            <v-text-field
              style="marigin-top: 0px; padding-top: 0px;"
              v-model="value"
              class="mytext"
            ></v-text-field>
          </div>
          <div v-else-if="action.actionType === 'submenu'">
            <p class="pStyle">
              {{ trans[identifier] }}
            </p>
            <v-select
              v-model="command"
              :items="action.submenu"
              item-text="label"
              item-value="id"
              style="padding: 2px; padding-top: 0px;"
              class="myswitch"
            >
            </v-select>
          </div>
          <div v-else-if="action.actionType === 'normal'">
            <SimpleButton @click="callback(action.id)">
              {{ trans[action.id] }}
            </SimpleButton>
          </div>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import {
  Identifier,
  compose,
  ActionView,
  swatches,
  snapshotNameRules,
  isValidSnapshotName,
} from "../common/types";
import { Prop, Component } from "vue-property-decorator";
import MultiSelect from "./MultiSelect.vue";
import bus from "../common/event-bus";
import Base from "@/components/Base.vue";
import SimpleButton from "./SimpleButton.vue";
import { ColorConfig } from "@/common/rule";

@Component({
  components: { MultiSelect, SimpleButton },
})
export default class Action extends Base {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  action: ActionView = this.$controller.action.getAction(this.identifier);

  swatches = swatches; //调色盘的预定义颜色
  dialog: boolean = false;

  text: string = "";

  rules = snapshotNameRules;

  get invalidSnapshotName() {
    return !isValidSnapshotName(this.text);
  }

  get tooltip(): undefined | string {
    if (!this.action || this.action.actionType === "prompt") {
      return undefined;
    }
    const tp = this.trans[`<tooltip>${this.action.id}`];
    return tp;
  }

  get command() {
    return compose([this.identifier, this.value.toString()]);
  }

  set command(cmd) {
    this.callback(cmd);
  }

  get value() {
    return this.$store.state.config[this.identifier];
  }

  set value(val) {
    this.callback(this.identifier, val);
  }

  get color() {
    const color = this.value as ColorConfig;
    if (this.$vuetify.theme.dark) {
      return color.dark;
    } else {
      return color.light;
    }
  }

  set color(val) {
    if (this.$vuetify.theme.dark) {
      this.callback(this.identifier, { ...this.value, dark: val });
    } else {
      this.callback(this.identifier, { ...this.value, light: val });
    }
  }

  async sync() {
    this.action = this.$controller.action.getAction(this.identifier);
  }

  mounted() {
    if (["submenu", "param_normal"].includes(this.action.actionType)) {
      bus.gon(this.identifier, this.sync);
    }
  }
}
</script>

<style scoped>
.myswitch {
  margin-top: 1px;
  margin-left: 5px;
  margin-right: 5px;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}
.myswitch >>> .v-input__slot {
  margin-bottom: 1px !important;
}
.myswitch >>> .v-select__selection--comma {
  margin-bottom: 0px;
  min-height: 20px;
}
.actionStyle {
  margin-top: 0px;
  margin-left: 2px;
  margin-right: 2px;
  text-align: center;
}
.pStyle {
  margin-bottom: 4px;
  text-align: left;
}

/* .mytext >>> .v-messages {
  min-height: 0px;
} */
.mytext >>> .v-input__slot {
  margin-bottom: 0px !important;
}
</style>
