<template>
  <div>
    <v-expansion-panels>
      <div v-for="(cate, index) in cates" :key="cate" style="width: 50%;">
        <v-subheader style="text-align: left; padding: 0px;"
          >{{ trans[cate] }}
        </v-subheader>
        <Action
          v-for="actionId in actionKeys[index]"
          :identifier="actionId"
          :key="actionId"
        ></Action>
      </div>
    </v-expansion-panels>
    <SimpleButton @click="restore">{{
      trans["restoreMultiDefault"]
    }}</SimpleButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { Identifier, Category } from "../common/types";
import Action from "../components/Action.vue";
import SimpleButton from "@/components/SimpleButton.vue";
import Base from "@/components/Base.vue";

@Component({
  components: {
    KeyConfig,
    Action,
    SimpleButton,
  },
})
export default class SwitchGroups extends Base {
  @Prop({ default: [] }) readonly cates!: Category[];
  actionKeys: Array<Identifier[]> = this.cates.map((x) =>
    this.$controller.action.getKeys(x as Category)
  );

  restore() {
    for (const cate of this.cates) {
      this.callback("restoreMultiDefault", cate);
    }
  }
}
</script>

<style scoped></style>
