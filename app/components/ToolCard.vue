<template>
  <div :id="tool.id" class="tool-card">
    <Icon :name="tool.id" :size="36" class="tool-icon" />
    <div class="tool-info">
      <div class="tool-name">{{ tool.name }}</div>
    </div>
  </div>
</template>

<script setup>
import Icon from './Icon.vue'

const props = defineProps({
  tool: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
@import '../styles/ToolCard.scss';
</style>