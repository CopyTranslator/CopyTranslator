<template>
  <div
    contenteditable="true"
    class="dict"
    v-bind:style="dictStyle"
    v-if="dictResult && dictResult.valid"
    @contextmenu="openMenu('contrastContext')"
  >
    <p class="dictSrc noMargin">[{{ dictResult.words }}]</p>
    <div v-if="dictResult.phonetics.length != 0">
      <p class="notation noMargin">Phonetic:</p>
      <span
        class="dictPhonetic noMargin"
        v-for="item in dictResult.phonetics"
        :key="item.type + item.value"
      >
        [{{ item.type }}]{{ item.value }} &nbsp;
      </span>
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
import { Mixins, Component } from "vue-property-decorator";

@Component
export default class DictResult extends Mixins(BaseView) {
  get dictStyle() {
    return {
      fontSize: this.dictSize.toString() + "px",
      height: "100%;",
      color: this.fontColor,
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
  height: 100%;
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
