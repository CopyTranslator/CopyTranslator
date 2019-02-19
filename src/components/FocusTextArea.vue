<template>
    <div>
        <StatusBar></StatusBar>
        <mu-row>
            <hsc-menu-style-white style="width:100%">
                <hsc-menu-context-menu style="width:100%">
                    <mu-text-field v-if="sharedResult" v-model="sharedResult.result" multi-line :rows="4"
                                   full-width></mu-text-field>
                    <template slot="contextmenu">
                        <hsc-menu-item :label="$t('copySource')"/>
                        <hsc-menu-item :label="$t('copySource')"/>
                        <hsc-menu-item :label="$t('contrastMode')" @click="changeMode('Contrast')"/>
                    </template>
                </hsc-menu-context-menu>
            </hsc-menu-style-white>
        </mu-row>
    </div>
</template>

<script>
import StatusBar from "../components/StatusBar";
import BaseView from "./BaseView";

export default {
  name: "FocusMode",
  mixins: [BaseView],
  components: { StatusBar }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
