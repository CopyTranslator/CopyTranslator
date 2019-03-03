<template>
    <div contenteditable="true" class="dict" v-bind:style="dictStyle" v-if="sharedResult&&sharedResult.dict">
        <p class="dictSrc">[{{sharedResult.src}}]</p>
        <p class="dictResult">{{sharedResult.result}}</p>
        <div v-if="sharedResult.phonetic">
            <p class="notation">Phonetic:</p>
            <p class="dictPhonetic" v-for="item in sharedResult.phonetic" :key="item.name">{{item.name}}:[{{item.value}}]</p>
        </div>
        <div>
            <p class="notation">Basic Explains:</p>
            <p class="dictExp" v-for="item in sharedResult.dict" :key="item">{{item}}</p>
        </div>
    </div>
</template>

<script>
import BaseView from "./BaseView";

export default {
  name: "DictResult",
  mixins: [BaseView],
  props: ["size"],
  computed: {
    dictStyle() {
      return {
        fontSize: this.size.toString() + "px",
        height: "100%;"
      };
    }
  }
};
</script>

<style scoped>
.dict {
  text-align: left;
}

.notation {
  color: cornflowerblue;
}

.dictSrc {
  color: deeppink;
}

.dictExp {
  margin-left: 10vw;
}
.dictPhonetic{
    margin-left: 10vw;
}
</style>
