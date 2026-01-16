<template>
  <NuxtLink :to="tool.path" class="tool-card" :id="tool.id">
    <Icon :name="tool.id" :size="36" class="tool-icon" />
    <div class="tool-info">
      <div class="tool-name">{{ tool.name }}</div>
    </div>
  </NuxtLink>
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

<style>
@import '../styles/ToolCard.css';
</style>