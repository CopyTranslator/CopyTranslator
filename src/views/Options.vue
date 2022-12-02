<template>
  <div style="text-align: left; overflow: auto; height: 100%;">
    <Action
      v-for="actionId in actionKeys"
      :identifier="actionId"
      :key="actionId"
    ></Action>
    <SimpleButton
      @click="callback('restoreMultiDefault', optionType)"
      v-if="restoreButton"
      >{{ trans["restoreMultiDefault"] }}</SimpleButton
    >
  </div>
</template>

<script lang="ts">
import Action from "../components/Action.vue";
import { Prop, Component, Vue } from "vue-property-decorator";
import { Identifier, MenuActionType, Category } from "../common/types";
import BaseView from "@/components/BaseView.vue";
import SimpleButton from "@/components/SimpleButton.vue";

@Component({
  components: {
    Action,
    SimpleButton,
  },
})
export default class Options extends BaseView {
  @Prop({ default: undefined }) readonly optionType!: MenuActionType | Category;
  @Prop({ default: true }) readonly restoreButton!: boolean;
  actionKeys: Identifier[] = this.$controller.action.getKeys(this.optionType);
}
</script>

<style scoped></style>
