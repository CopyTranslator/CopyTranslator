<template>
  <div style="text-align: center; width: 100%;">
    <v-btn v-bind="{ ...$attrs }" v-on="$listeners" class="defaultBtn">
      <template
        v-for="(_, scopedSlotName) in $scopedSlots"
        #[scopedSlotName]="slotData"
      >
        <slot :name="scopedSlotName" v-bind="slotData" />
      </template>
      <template v-for="(_, slotName) in $slots" #[slotName]>
        <slot :name="slotName" />
      </template>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false,
})
export default class SimpleButton extends Vue {}
</script>

<style scoped>
.defaultBtn {
  width: calc(100% - 10px);
  margin-top: 4px;
}
</style>
