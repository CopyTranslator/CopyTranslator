<template>
    <div class="draggable" v-on:dblclick="minify" v-on:mousedown="isFollow=!isFollow" v-on:mouseup="isFollow=!isFollow" onmousemove="moveWindow"></div>
</template>

<script>
export default {
  name: "StatusBar",
  data: function() {
    return {
      isFollow: false
    };
  },
  methods: {
    minify(event) {
      console.log(event);
      console.log("最小化");
    },
    moveWindow(event) {
      console.log(event);
    }
  }
};
</script>

<style scoped>
.draggable {
  height: 15px;
  background: red;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>
