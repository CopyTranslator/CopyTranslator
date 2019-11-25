<template>
  <div>
    <v-app>
      <v-app-bar app color="purple" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-text-field
          solo-inverted
          flat
          hide-details
          label="Search in text"
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        app
        disable-resize-watcher
        :permanent="drawer"
        hide-overlay
        :width="200"
      >
        <v-switch v-model="horizontal" label="Horizontal"></v-switch>
      </v-navigation-drawer>
      <ContrastPanel
        :style="area"
        v-bind:class="{ active: drawer }"
      ></ContrastPanel>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContrastPanel from "../components/ContrastPanel.vue";

export default Vue.extend({
  name: "App",
  components: { ContrastPanel },
  data: () => ({
    barWidth: 200,
    windowWidth: 0
  }),
  methods: {
    syncHeight() {
      this.windowWidth = window.innerWidth;
    }
  },
  mounted() {
    // @ts-ignore

    window.addEventListener("resize", this.syncHeight);
  },
  destroyed() {
    window.removeEventListener("resize", this.syncHeight);
  },
  watch: {
    drawer(val) {
      if (val) {
        this.barWidth = 200;
      } else {
        this.barWidth = 0;
      }
    }
  },
  computed: {
    area() {
      return {
        "margin-top": "64px",
        width: (this.windowWidth - this.barWidth).toString() + "px"
      };
    },
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("switchDrawer", val);
      }
    },
    horizontal: {
      get() {
        return this.$store.state.horizontal;
      },
      set(val) {
        this.$store.commit("switchHorizontal", val);
      }
    }
  }
});
</script>
<style>
.active {
  margin-left: 200px;
}
::-webkit-scrollbar {
  display: none;
}
</style>
