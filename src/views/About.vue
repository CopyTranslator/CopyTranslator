<template>
  <div>
    <div class="logo"></div>
    <p style="text-align: center;">CopyTranslator {{ version }}</p>
    <p>
      If you found it useful, please give me a star on GitHub or introduce to
      your friend.
      <br />
      如果您感觉本软件对您有所帮助，请在项目Github上给个star或是介绍给您的朋友，谢谢。
      <br />
      本软件免费开源，如果您是以付费的方式获得本软件，那么你应该是被骗了。[○･｀Д´･○]
    </p>
    <Action identifier="checkUpdate"></Action>
    <Action identifier="changelog"></Action>
    <Action identifier="userManual"></Action>
    <Action identifier="homepage"></Action>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { version } from "@/common/constant";
import Action from "../components/Action.vue";
import Base from "@/components/Base.vue";

@Component({
  components: { Action },
})
export default class DrogCopyConfig extends Base {
  version = version;
}
</script>

<style scoped>
.logo {
  background-image: url("../images/icon.png");
  background-position: center;
  background-size: contain;
  height: 150px;
  width: 100%;
}
</style>
