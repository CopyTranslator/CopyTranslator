<template>
  <div contenteditable="true" @contextmenu="openMenu('contrastContext')">
    <div style="height: 100%;">
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
          <span style="display: block; padding-bottom: 5px;">
            {{ val }}
          </span>
        </div>
      </div>
    </div>
    <div style="font-size: 15px; position: absolute; right: 0px; bottom: 5px;">
      <div
        v-if="
          status !== 'Translating' &&
          sharedResult.engine !== '' &&
          sharedResult.engine !== currentEngine &&
          mode === 'normal'
        "
      >
        <a>
          <span>
            {{ currentEngine }}&nbsp;{{ trans["fallbackPrompt1"]
            }}{{ sharedResult.engine }}{{ trans["fallbackPrompt2"] }}
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
import { Mixins, Component, Vue } from "vue-property-decorator";
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
