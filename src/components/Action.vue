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
          <p v-if="action.actionType === 'prompt'" style="text-align: left;">
            {{ trans[action.id] }}
          </p>
          <EngineGroup
            v-else-if="action.actionType === 'multi_select'"
            :identifier="action.id"
          ></EngineGroup>
          <div v-else-if="action.actionType === 'constant'">
            <p class="pStyle">{{ trans[identifier] }}</p>
            <v-text-field v-model="value"></v-text-field>
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
              style="padding: 2px;"
            >
            </v-select>
          </div>
          <div v-else-if="action.actionType === 'normal'">
            <v-btn
              @click="callback(action.id)"
              width="98%"
              style="margin-top: 4px;"
            >
              {{ trans[action.id] }}
            </v-btn>
          </div>
        </div>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { Identifier, compose, ActionView } from "../common/types";
import { Prop, Component, Vue } from "vue-property-decorator";
import EngineGroup from "./EngineGroup.vue";
import bus from "../common/event-bus";

@Component({
  components: { EngineGroup },
})
export default class Action extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  action: ActionView = this.$controller.action.getAction(this.identifier);

  callback(...args: any[]) {
    bus.at("dispatch", ...args);
  }

  get tooltip(): undefined | string {
    if (
      !this.action ||
      this.action.actionType === "normal" ||
      this.action.actionType === "prompt"
    ) {
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

  async sync() {
    this.action = this.$controller.action.getAction(this.identifier);
  }

  get trans() {
    return this.$store.getters.locale;
  }

  mounted() {
    if (this.action?.actionType == "submenu") {
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
  margin-bottom: 0px !important;
}
.actionStyle {
  margin-top: 0px;
  margin-left: 2px;
  margin-right: 2px;
  text-align: center;
}
.pStyle {
  margin-bottom: 0px;
  text-align: left;
}
</style>
