<template>
  <div
    contenteditable="true"
    class="dict"
    v-bind:style="dictStyle"
    v-if="dictResult && dictResult.valid"
  >
    <p class="dictSrc noMargin">[{{ dictResult.words }}]</p>
    <div v-if="dictResult.phonetics.length != 0">
      <p class="notation noMargin">Phonetic:</p>
      <p
        class="dictPhonetic noMargin"
        v-for="item in dictResult.phonetics"
        :key="item.type + item.value"
      >
        [{{ item.type }}]{{ item.value }}
      </p>
    </div>
    <div v-if="dictResult.explains.length > 0">
      <p class="notation noMargin">Basic Explains:</p>
      <p
        class="dictExp noMargin"
        v-for="item in dictResult.explains"
        :key="item.type + item.trans"
      >
        {{ item.type.length > 0 ? "[" + item.type + "] " : "" }}{{ item.trans }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import BaseView from "./BaseView.vue";
import { Mixins, Component, Vue } from "vue-property-decorator";

const AppProps = Vue.extend({
  props: { size: Number }
});

@Component
export default class DictResult extends Mixins(BaseView, AppProps) {
  get dictStyle() {
    return {
      fontSize: this.size.toString() + "px",
      height: "100%;"
    };
  }
}
</script>

<style scoped>
.dict {
  text-align: left;
  margin-top: 0%;
  padding-top: 0%;
  top: 0%;
}

.notation {
  color: cornflowerblue;
}

.dictSrc {
  color: deeppink;
}

.dictExp {
  margin-left: 10vw;
  overflow: hidden;
}
.dictPhonetic {
  margin-left: 10vw;
}
.noMargin {
  margin: 0px;
}
</style>
