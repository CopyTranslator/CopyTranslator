<template>
  <div class="home">
    <FocusMode msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import FocusMode from "@/components/FocusMode.vue";

export default {
  name: "home",
  components: {
    FocusMode
  }
};
</script>
