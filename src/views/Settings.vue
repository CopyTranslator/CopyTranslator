<template>
    <div v-on:contextmenu="openMenu('Settings')">
        <StatusBar></StatusBar>
        <div v-if="config">
            <el-row style="text-align:left;">
                <el-col :span="6" align-self="start">
                    <el-row>
                        <el-switch v-model="config.autoCopy" :active-text="$t('autoCopy')"
                                   @change="setValue('autoCopy')"></el-switch>
                    </el-row>
                    <el-row>
                        <el-switch v-model="config.incrementalCopy" :active-text="$t('incrementalCopy')"
                                   @change="setValue('incrementalCopy')"></el-switch>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-switch v-model="config.listenClipboard" :active-text="$t('listenClipboard')"
                                   @change="setValue('listenClipboard')"></el-switch>
                    </el-row>
                    <el-row>
                        <el-switch v-model="config.stayTop" :active-text="$t('stayTop')"
                                   @change="setValue('stayTop')"></el-switch>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-switch v-model="config.autoShow" :active-text="$t('autoShow')"
                                   @change="setValue('autoShow')"></el-switch>
                    </el-row>
                    <el-row>
                        <el-switch v-model="config.detectLanguage" :active-text="$t('detectLanguage')"
                                   @change="setValue('detectLanguage')"></el-switch>
                    </el-row>
                </el-col>
                <el-col :span="6">
                    <el-row>
                        <el-switch v-model="config.autoHide" :active-text="$t('autoHide')"
                                   @change="setValue('autoHide')"></el-switch>
                    </el-row>
                    <el-row>
                        <el-switch v-model="config.smartDict" :active-text="$t('smartDict')"
                                   @change="setValue('smartDict')"></el-switch>
                    </el-row>
                </el-col>
            </el-row>
            <el-row>
                <el-col v-if="locale" :span="24">
                    <el-select v-model="locale">
                        <el-option v-for="locale in locales" :key="locale.short" :label="locale.localeName"
                                   :value="locale.short"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-button @click="backStored">{{$t("return")}}</el-button>
        </div>
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
      locales: this.$controller.locales.getLocales(),
      prevRoute: undefined,
      routeName: "settingsConfig"
    };
  },
  components: {
    StatusBar
  },
  watch: {
    locale: function(newLocale, oldLocale) {
      this.$controller.setByKeyValue("locale", newLocale);
      if (oldLocale !== undefined) {
        this.$controller.win.load("Settings");
      }
      this.syncConfig();
    }
  },
  mounted: function() {
    this.syncConfig();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name) vm.$controller.win.stored = from.name;
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
    backStored() {
      this.$router.push({ name: this.$controller.win.stored });
    }
  }
};
</script>

<style scoped>
</style>
