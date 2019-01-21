<template>
    <div>
      <StatusBar></StatusBar>
      <v-textarea style="height: 100%;" full-width
                auto-grow
                v-model="showSource"
                outline
    ></v-textarea>
    <div>
      <v-btn >翻译</v-btn>
      <v-btn to="/focus">切换模式</v-btn>
      <v-btn >设置</v-btn>
    </div>
    <v-textarea style="height: 100%;" full-width
                auto-grow
                v-model="showResult"
                outline
    ></v-textarea>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
export default {
  name: "Contrast",
  components:{
    StatusBar
  },
  data:()=>{
    return {
      showResult:"",
      showSource:""
    }
  }
};
</script>

<style scoped>
</style>
