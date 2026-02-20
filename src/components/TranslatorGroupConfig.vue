<template>
  <v-card flat class="mb-4 transparent">
    <v-card-title class="subtitle-2 py-2 px-0">
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn icon small @click="showAddDialog = true" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    
    <div class="caption grey--text mb-2" v-if="description">{{ description }}</div>

    <v-card flat outlined>
      <draggable v-model="localList" @change="updateConfig" handle=".handle">
        <div v-for="(id, index) in localList" :key="id" class="group-item">
          <v-icon class="handle mr-3">mdi-drag</v-icon>
          <div class="group-item-name">{{ getTranslatorName(id) }}</div>
          <v-spacer></v-spacer>
          <v-btn icon small @click="removeTranslator(index)" color="grey">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-if="localList.length === 0" class="caption grey--text text-center py-4">
          {{ trans['noItems'] || '暂无项目' }}
        </div>
      </draggable>
    </v-card>

    <!-- Add Dialog -->
    <v-dialog v-model="showAddDialog" max-width="400" scrollable>
      <v-card>
        <v-card-title class="subtitle-1">
          {{ trans['addTranslator'] || '添加翻译器' }}
        </v-card-title>
        <v-card-text style="height: 300px;" class="px-0">
          <v-list dense>
            <template v-if="remainingTranslators.length > 0">
              <v-list-item
                v-for="id in remainingTranslators"
                :key="id"
                @click="addTranslator(id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ getTranslatorName(id) }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon small color="primary">mdi-plus</v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-content class="grey--text caption text-center">
                {{ trans['noMoreTranslators'] || '没有更多可用翻译器' }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAddDialog = false">{{ trans['cancel'] || '取消' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import draggable from "vuedraggable";
import { translatorTypes } from "@/common/types";
import { builtInTranslatorMetadata, isBuiltInTranslator } from "@/common/translate/metadata";
import { customTranslatorManager } from "@/common/translate/custom-translators";
import eventBus from "@/common/event-bus";

@Component({
  components: {
    draggable,
  },
})
export default class TranslatorGroupConfig extends Vue {
  @Prop({ required: true }) configKey!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ default: "" }) description!: string;

  showAddDialog = false;
  localList: string[] = [];

  get trans() {
    return this.$store.getters.locale;
  }

  get remainingTranslators(): string[] {
    // Only show enabled translators as candidates
    const enabled = this.$store.state.config["translator-enabled"] || [];
    return enabled.filter((id: string) => !this.localList.includes(id));
  }

  @Watch('$store.state.config', { deep: true, immediate: true })
  onConfigChange() {
      const val = this.$store.state.config[this.configKey];
      // Simple array comparison to avoid unnecessary updates
      if (JSON.stringify(val) !== JSON.stringify(this.localList)) {
          this.localList = val ? [...val] : [];
      }
  }

  getTranslatorName(translatorId: string): string {
    const localized = this.trans?.[translatorId];
    if (localized) {
      return localized;
    }
    // 尝试查找 tooltip 作为后备名称
    const tooltipKey = `<tooltip>${translatorId}`;
    if (this.trans?.[tooltipKey]) {
      return this.trans[tooltipKey];
    }

    const customConfig = customTranslatorManager.getConfig(translatorId);
    if (customConfig?.name) {
      return customConfig.name;
    }

    if (isBuiltInTranslator(translatorId)) {
      return builtInTranslatorMetadata[translatorId].name;
    }

    return translatorId;
  }

  addTranslator(id: string) {
    this.localList.push(id);
    this.updateConfig();
    this.showAddDialog = false;
  }

  removeTranslator(index: number) {
    this.localList.splice(index, 1);
    this.updateConfig();
  }

  updateConfig() {
      eventBus.at("dispatch", this.configKey, this.localList);
  }
}
</script>

<style scoped>
.group-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: white;
  transition: background-color 0.2s;
}
.group-item:hover {
  background-color: #f9f9f9;
}
.group-item:last-child {
  border-bottom: none;
}
.handle {
  cursor: move;
  color: #bdbdbd;
}
.handle:hover {
  color: #757575;
}
.group-item-name {
    font-size: 14px;
    font-weight: 500;
}
</style>
