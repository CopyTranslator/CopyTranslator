<template>
    <div>
      <StatusBar></StatusBar>
     <mu-container v-if="config"> 
  <mu-flex> 
    <mu-switch v-model="config.isCopy" :label="$t('autoCopy')" @click="setBool('isCopy')"></mu-switch>
  </mu-flex>
  <mu-flex >
    <mu-switch v-model="config.isListen" :label="$t('listenClipboard')" @click="setBool('isListen')"></mu-switch>
  </mu-flex>
  <mu-flex >
    <mu-switch v-model="config.isDete" :label="$t('detectLanguage')" @click="setBool('isDete')"></mu-switch>
  </mu-flex> 
</mu-container>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
export default {
  name: "Settings",
  data: function() {
    return {
      loaded: false,
      config: undefined
    };
  },
  components: {
    StatusBar
  },
  mounted: function() {
    this.syncConfig();
  },
  methods: {
    syncConfig() {
      this.config = this.$controller.config.getValues();
    },
    setBool(keyValue) {
      this.$controller.config.setByKeyValue(keyValue, this.config[keyValue]);
      this.syncConfig();
    }
  }
};
</script>

<style scoped>
</style>
