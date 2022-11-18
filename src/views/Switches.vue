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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import KeyConfig from "@/components/KeyConfig.vue";
import { Identifier, Category } from "../common/types";
import Action from "../components/Action.vue";

@Component({
  components: {
    KeyConfig,
    Action,
  },
})
export default class SwitchGroups extends Vue {
  @Prop({ default: [] }) readonly cates!: Category[];
  actionKeys: Array<Identifier[]> = this.cates.map((x) =>
    this.$controller.action.getKeys(x as Category)
  );

  get trans() {
    return this.$store.getters.locale;
  }
}
</script>

<style scoped></style>
