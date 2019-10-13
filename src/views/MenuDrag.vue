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
<script>
import draggable from "vuedraggable";

export default {
  name: "MenuDrag",
  components: {
    draggable
  },
  data() {
    return {
      selections: [],
      candidates: []
    };
  },
  mounted: function() {
    this.$proxy.getKeys("MenuDrag").then(res => {
      this.candidates = res.sort();
    });
  },
  methods: {
    log: function(evt) {
      this.candidates.sort();
    },
    select(index) {
      this.selections.push(this.candidates[index]);
      this.candidates.splice(index, 1);
    },
    unselect(index) {
      this.candidates.push(this.selections[index]);
      this.candidates.sort();
      this.selections.splice(index, 1);
    }
  }
};
</script>
