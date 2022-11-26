<template>
  <v-tooltip bottom open-delay="100" :disabled="!tooltip">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <v-btn
          color="primary"
          small
          depressed
          fab
          @click="handle(left_click, true)"
          @contextmenu="handle(right_click, false)"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ trans[tooltip] }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import bus from "../common/event-bus";

@Component({
  components: {},
})
export default class Action extends Vue {
  @Prop({ default: undefined }) readonly icon!: string;
  @Prop({ default: undefined }) readonly left_click!: string;
  @Prop({ default: undefined }) readonly right_click!: string;
  @Prop({ default: undefined }) readonly tooltip!: string;

  handle(identifier: string | undefined, isLeft: boolean) {
    if (identifier == undefined) {
      //调用父组件的事件
      if (isLeft) {
        this.$emit("click");
      } else {
        this.$emit("contextmenu");
      }
      return;
    }
    bus.at("dispatch", identifier);
  }

  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
