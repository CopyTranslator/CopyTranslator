<template>
  <el-row>
    <el-col :span="12">
      <div>
        <h3>菜单项</h3>
        <draggable :list="selections" group="people" @change="log">
          <div
            v-for="(key, index) in selections"
            :key="key"
            @click="unselect(index)"
          >
            {{ $t(key) }}
          </div>
        </draggable>
      </div>
    </el-col>
    <el-col :span="12">
      <div>
        <h3>候选菜单项</h3>
        <draggable :list="candidates" group="people" @change="log">
          <div
            v-for="(key, index) in candidates"
            :key="key"
            @click="select(index)"
          >
            {{ $t(key) }}
          </div>
        </draggable>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts">
const draggable = require("vuedraggable");
import Vue from "vue";
import Component from "vue-class-component";
import { Identifier } from "../tools/identifier";

@Component({
  components: {
    draggable
  }
})
export default class MenuDrag extends Vue {
  selections: Identifier[] = [];
  candidates: Identifier[] = [];

  mounted() {
    this.$proxy.getKeys("draggableOptions").then(res => {
      this.candidates = res.sort();
    });
  }

  log(evt: any) {
    this.candidates.sort();
  }
  select(index: number) {
    this.selections.push(this.candidates[index]);
    this.candidates.splice(index, 1);
  }
  unselect(index: number) {
    this.candidates.push(this.selections[index]);
    this.candidates.sort();
    this.selections.splice(index, 1);
  }
}
</script>
