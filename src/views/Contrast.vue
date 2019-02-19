<template>
    <div v-on:contextmenu="openMenu('Contrast')">
        <StatusBar ref="bar"></StatusBar>
        <el-row class="contrast" :gutter="5">
            <el-col :span="20">
                <textarea class="contrastText" v-if="sharedResult" :style="area" v-model="sharedResult.src"></textarea>
                <textarea class="contrastText" :style="area" v-if="sharedResult" v-model="sharedResult.result"></textarea>
            </el-col>
            <el-col :span="4" class="controlPanel" v-if="config">
               <el-switch v-model="config.autoCopy" :active-text="$t('autoCopy')" @change="setValue('autoCopy')"></el-switch>   
               <el-switch v-model="config.incrementalCopy" :active-text="$t('incrementalCopy')"
                              @change="setValue('incrementalCopy')"></el-switch>
                <el-switch v-model="config.listenClipboard" :active-text="$t('listenClipboard')"
                              @change="setValue('listenClipboard')"></el-switch>
                <el-switch v-model="config.stayTop" :active-text="$t('stayTop')"
                              @change="setValue('stayTop')"></el-switch>
                
                    <el-switch v-model="config.autoShow" :active-text="$t('autoShow')"
                              @change="setValue('autoShow')"></el-switch>
                  <el-switch v-model="config.detectLanguage" :active-text="$t('detectLanguage')"
                              @change="setValue('detectLanguage')"></el-switch>
                  
                    <el-switch v-model="config.autoHide" :active-text="$t('autoHide')"
                              @change="setValue('autoHide')"></el-switch>
                    <el-switch v-model="config.smartDict" :active-text="$t('smartDict')"
                              @change="setValue('smartDict')"></el-switch>
                <p style="text-align: left">{{$t('sourceLanguage')}}</p>
                <el-select style="width:100%" v-model="source" placeholder="请选择">
                    <el-option
                            v-for="item in languages" 
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <p style="text-align: left">{{$t('targetLanguage')}}</p>
                <el-select v-model="target" placeholder="请选择" name="???">
                    <el-option
                            v-for="item in languages"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button class="noMargin"  @click="changeMode('Focus')">{{$t("switchMode")}}</el-button>
                <el-button class="noMargin" @click="translate">{{$t("translate")}}</el-button>
                <el-button class="noMargin" @click="changeMode('Settings')">{{$t("settings")}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";
import WindowController from "../components/WindowController";
import Adjustable from "./Adjustable";

export default {
  name: "Contrast",
  mixins: [BaseView, WindowController, Adjustable],
  data: function() {
    return {
      config: undefined,
      size: this.$controller.config.values.contrast.fontSize
    };
  },
  computed: {
    area() {
      return `fontSize:${this.size.toString()}px;height:${(this.windowHeight -
        this.barHeight) /
        2}px`;
    }
  },
  components: {
    StatusBar
  },
  mounted: function() {
    this.barHeight = this.$refs.bar.$el.clientHeight;
    this.syncConfig();
  },
  methods: {
    translate() {
      this.$controller.tryTranslate(this.sharedResult.src);
    },
    syncConfig() {
      this.config = this.$controller.config.getValues();
    },
    setValue(keyValue) {
      this.$controller.setByKeyValue(keyValue, this.config[keyValue]);
      this.syncConfig();
    }
  }
};
</script>

<style scoped>
p {
  font-size: 14px;
}
.contrastText {
  width: 100%;
  padding: 0;
}

.contrast {
  /* 不能取名container，不要忘记之前的教训，因为有的contain class 是有width 限制的 */
  width: 100%;
}

.noMargin {
  margin: 0 !important;
}

.controlPanel {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
</style>
