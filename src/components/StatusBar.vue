<template>
    <div class="draggable" v-on:dblclick="minify" v-on:mousedown="mouseDown" v-on:mouseup="isFollow=!isFollow" v-on:mousemove="moveWindow"></div>
</template>

<script>
export default {
  name: "StatusBar",
  data: function() {
    console.log("in");

    return {
      isFollow: false,
      x: 0,
      y: 0
    };
  },
  methods: {
    minify(event) {
      console.log(event);
      console.log("最小化");
    },
    mouseDown(event) {
      this.x = event.screenX;
      this.y = event.screenY;
      this.isFollow = true;
    },
    moveWindow(event) {
      if (this.isFollow) {
        let x = event.screenX;
        let y = event.screenY;
        let dx = x - this.x;
        let dy = y - this.y;
        console.log(dx, dy);
        this.x = x;
        this.y = y;
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
