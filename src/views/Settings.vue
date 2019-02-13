<template>
    <div v-on:contextmenu="openMenu('Settings')">
      <StatusBar></StatusBar>
     <mu-container v-if="config" ref="config"> 
     <mu-row style="text-align:left">
      <mu-col span="3" align-self="start" >
        <mu-switch v-model="config.autoCopy" :label="$t('autoCopy')" @click="setValue('autoCopy')"></mu-switch>
        <mu-switch v-model="config.incrementalCopy" :label="$t('incrementalCopy')" @click="setValue('incrementalCopy')"></mu-switch>
        </mu-col>
      <mu-col span="3">
        <mu-switch v-model="config.listenClipboard" :label="$t('listenClipboard')" @click="setValue('listenClipboard')"></mu-switch>
        <mu-switch v-model="config.stayTop" :label="$t('stayTop')" @click="setValue('stayTop')"></mu-switch>
        </mu-col>
      <mu-col span="3">
        <mu-switch v-model="config.autoShow" :label="$t('autoShow')" @click="setValue('autoShow')"></mu-switch>
        <mu-switch v-model="config.detectLanguage" :label="$t('detectLanguage')" @click="setValue('detectLanguage')"></mu-switch>
      </mu-col>
    <mu-col span="3">
      <mu-switch v-model="config.autoHide" :label="$t('autoHide')" @click="setValue('autoHide')"></mu-switch>
      <mu-switch v-model="config.smartDict" :label="$t('smartDict')" @click="setValue('smartDict')"></mu-switch>
    </mu-col>  
    </mu-row >
    <mu-row @click="loaded=true">
        <mu-select :label="$t('localeSetting')" full-width v-model="locale" >
          <mu-option v-for="locale in locales"  :key="locale.short" :label="locale.localeName" :value="locale.short"></mu-option>
      </mu-select>
      </mu-row>
      <mu-button full-width color="primary" @click="backStored" >{{$t("return")}}</mu-button>
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
      locales: [],
      loaded: false,
      prevRoute: undefined
    };
  },
  components: {
    StatusBar
  },
  watch: {
    locale: function(newLocale, oldLocale) {
      this.$controller.setByKeyValue("locale", newLocale);
      if (this.loaded) {
        this.$controller.focusWin.load("Settings");
      }
      this.syncConfig();
    }
  },
  mounted: function() {
    this.syncConfig();
    this.getLocales();
    this.$nextTick(() => {
      this.resize(null, this.$el.clientHeight + 10);
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name) vm.$controller.focusWin.stored = from.name;
    });
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
    },
    backStored() {
      this.$router.push({ name: this.$controller.focusWin.stored });
    }
  }
};
</script>

<style scoped>
</style>
