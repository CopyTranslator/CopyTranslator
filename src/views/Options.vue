<template>
  <div style="text-align: left; overflow: scroll; height: 95vh;">
    <Action
      v-for="actionId in actionKeys"
      :identifier="actionId"
      :key="actionId"
    ></Action>
  </div>
</template>

<script lang="ts">
import Action from "../components/Action.vue";
import { Prop, Component, Vue } from "vue-property-decorator";
import { Identifier, MenuActionType, Category } from "../common/types";

@Component({
  components: {
    Action,
  },
})
export default class Options extends Vue {
  @Prop({ default: undefined }) readonly optionType!: MenuActionType | Category;
  actionKeys: Identifier[] = this.$controller.action.getKeys(this.optionType);
}
</script>

<style scoped></style>
