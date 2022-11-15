<template>
  <div>
    <div contenteditable="true">
      <div v-if="!config['contrastDict'] || !dictResult.valid">
        <div v-if="chineseStyle">
          <span
            v-for="(val, key) in sentences"
            :key="key"
            @mouseover="mouseOver(key)"
            style="display: block;"
          >
            {{ val }}
          </span>
        </div>
        <div v-else>
          <div
            v-for="(val, key) in sentences"
            :key="key"
            @mouseover="mouseOver(key)"
          >
            <span style="display: block;">
              {{ val }}
            </span>
            <br />
          </div>
        </div>
      </div>
      <DictResultPanel
        v-if="config['contrastDict'] && dictResult.valid"
      ></DictResultPanel>
    </div>
    <div style="font-size: 15px; position: absolute; right: 0px; bottom: 5px;">
      <div v-if="sharedResult.engine !== currentEngine">
        <a>
          <span>
            {{ currentEngine }}引擎不支持此语言，此结果由备用引擎{{
              sharedResult.engine
            }}提供
          </span>
        </a>
      </div>
      <div v-else-if="currentEngine === 'keyan'">
        <a @click="toKeyan()">
          <span>来⾃棵岩翻译 免费⼀键翻译全⽂>>></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Mixins, Component, Vue, Watch } from "vue-property-decorator";
import DictResultPanel from "./DictResult.vue";
import BaseView from "./BaseView.vue";

const AppProps = Vue.extend({
  props: {
    sentences: Array,
    chineseStyle: Boolean,
  },
});

@Component({
  components: {
    DictResultPanel,
  },
})
export default class CoTextArea extends Mixins(Vue, AppProps, BaseView) {
  mouseOver(idx: number) {
    this.targetIdx = idx;
  }

  targetIdx: number = -1;
}
</script>

<style scoped>
/* span:hover {
  background: #fee972;
} */
</style>
