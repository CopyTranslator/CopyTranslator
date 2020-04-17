<template>
  <div v-if="action">
    <v-switch
      v-if="action.type === 'checkbox'"
      v-model="value"
      class="myswitch"
      :label="trans[action.id]"
    ></v-switch>
    <div v-else-if="action.type === 'submenu'">
      <p style="margin:0px;">{{ trans[identifier] }}</p>
      <v-select
        v-model="command"
        :items="action.submenu"
        item-text="label"
        item-value="id"
        style="margin:0px;padding:0px;"
      >
      </v-select>
    </div>
    <div v-else-if="action.type === 'normal'">
      <v-btn @click="callback(action.id)">
        {{ trans[action.id] }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Identifier,compose,ActionView } from "../common/types";
import { Prop, Component, Watch, Vue } from "vue-property-decorator";
import bus from "../common/event-bus";

@Component
export default class Action extends Vue {
  @Prop({ default: undefined }) readonly identifier!: Identifier;
  action: ActionView =this.$controller.action.getAction(
      this.identifier
    );

  callback(...args: any[]) {
    bus.at("dispatch",...args);
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
    this.action = this.$controller.action.getAction(
      this.identifier
    );
  }

  get trans(){
    return this.$store.getters.locale;
  }

  mounted() {
    if (this.action?.actionType == "submenu") {
      bus.on(this.identifier, this.sync);
    }
  }
}
</script>

<style scoped>
.myswitch {
  margin: 0px;
}
.myswitch >>> .v-messages {
  min-height: 0px;
}
.myswitch >>> .v-input__slot {
  margin-bottom: 0px !important;
}
</style>
