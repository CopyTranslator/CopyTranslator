<template>
    <div class="draggable" v-on:dblclick="minify" v-on:mousedown="bindDrag" ></div>
</template>

<script>
import WindowController from "./WindowController";
export default {
  mixins: [WindowController]
};
</script>

<style scoped>
.draggable {
  height: 15px;
  background: red;
}
</style>
