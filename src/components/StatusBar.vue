<template>
    <div class="draggable" v-on:dblclick="minify" v-on:mousedown="mouseDown" ></div>
</template>

<script>
export default {
  name: "StatusBar",
  data: function() {
    return {
      isFollow: false,
      x: 0,
      y: 0
    };
  },
  methods: {
    minify(event) {
      this.$ipcRenderer.send(this.$CONSTANT.ONMINIFYWINDOW, null);
    },
    mouseDown(event) {
      if (event.button === 0) {
        this.$ipcRenderer.send(this.$CONSTANT.ONDRAGWINDOW, {
          status: true,
          x: event.screenX,
          y: event.screenY
        });
      }
    }
  }
};
</script>

<style scoped>
.draggable {
  height: 15px;
  background: red;
  /*-webkit-user-select: none;*/
  /*-webkit-app-region: drag;*/
}
</style>
