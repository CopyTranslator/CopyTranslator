<template>
  <div
    contenteditable="true"
    class="dict"
    v-bind:style="dictStyle"
    v-if="sharedResult && sharedResult.dict"
  >
    <p class="dictSrc noMargin">
      [{{ sharedResult.src }}] {{ sharedResult.result }}
    </p>
    <!-- <p class="dictResult noMargin"></p> -->
    <div v-if="sharedResult.phonetic">
      <p class="notation noMargin">Phonetic:</p>
      <p
        class="dictPhonetic noMargin"
        v-for="item in sharedResult.phonetic"
        :key="item.name"
      >
        {{ item.name }}:[{{ item.value }}]
      </p>
    </div>
    <div>
      <p class="notation noMargin">Basic Explains:</p>
      <p class="dictExp noMargin" v-for="item in sharedResult.dict" :key="item">
        {{ item }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import BaseView from "./BaseView.vue";
import { Mixins, Component } from "vue-property-decorator";

@Component({
  props: { size: Number }
})
export default class DictResult extends Mixins(BaseView) {
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
