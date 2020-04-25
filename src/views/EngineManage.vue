<template>
  <div>
    <EngineGroup
      v-for="group in translatorGroups"
      :key="group"
      :identifier="group"
    >
    </EngineGroup>
  </div>
</template>

<script lang="ts">
import { shell } from "electron";
import { Component, Vue } from "vue-property-decorator";
import { Identifier, translatorGroups } from "../common/types";
import EngineGroup from "@/components/EngineGroup.vue";

@Component({
  components: { EngineGroup },
})
export default class EngineManage extends Vue {
  translatorGroups = translatorGroups;
}
</script>

<style scoped></style>
