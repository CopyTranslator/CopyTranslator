<template>
    <div v-on:contextmenu="openMenu('Settings')">
      <StatusBar></StatusBar>
     <mu-container v-if="config"> 
     <mu-row style="text-align:left">
      <mu-col span="3" align-self="start" >
        <mu-switch v-model="config.isCopy" :label="$t('autoCopy')" @click="setValue('isCopy')"></mu-switch>
        <mu-switch v-model="config.isContinus" :label="$t('incrementalCopy')" @click="setValue('isContinus')"></mu-switch>
        </mu-col>
      <mu-col span="3">
        <mu-switch v-model="config.isListen" :label="$t('listenClipboard')" @click="setValue('isListen')"></mu-switch>
        <mu-switch v-model="config.stayTop" :label="$t('stayTop')" @click="setValue('stayTop')"></mu-switch>
        </mu-col>
      <mu-col span="3">
        <mu-switch v-model="config.autoShow" :label="$t('autoShow')" @click="setValue('autoShow')"></mu-switch>
        <mu-switch v-model="config.isDete" :label="$t('detectLanguage')" @click="setValue('isDete')"></mu-switch>
      </mu-col>
    <mu-col span="3">
      <mu-switch v-model="config.autoHide" :label="$t('autoHide')" @click="setValue('autoHide')"></mu-switch>
      <mu-switch v-model="config.smartDict" :label="$t('smartDict')" @click="setValue('smartDict')"></mu-switch>
    </mu-col>  
    </mu-row >
        <mu-select :label="$t('localeSetting')" full-width v-model="locale" >
          <mu-option v-for="locale in locales"  :key="locale.short" :label="locale.localeName" :value="locale.short"></mu-option>
      </mu-select>
</mu-container>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import WindowController from "../components/WindowController";
export default {
  name: "Settings",
  mixins: [WindowController],
  data: function() {
    return {
      config: undefined,
      locale: undefined,
      locales: []
    };
  },
  components: {
    StatusBar
  },
  watch: {
    locale: function(newLocale, oldLocale) {
      this.$controller.setByKeyValue("locale", newLocale);
      this.syncConfig();
    }
  },
  mounted: function() {
    this.syncConfig();
    this.getLocales();
    this.resize(null, this.$el.clientHeight);
  },
  methods: {
    syncConfig() {
      this.config = this.$controller.config.getValues();
      this.locale = this.config.locale;
    },
    setValue(keyValue) {
      this.$controller.setByKeyValue(keyValue, this.config[keyValue]);
      this.syncConfig();
    },
    getLocales() {
      this.locales = this.$controller.locales.getLocales();
    }
  }
};
</script>

<style scoped>
</style>
