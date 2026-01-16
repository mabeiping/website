<template>
  <div class="show-content">
    <Content />
  </div>
</template>

<script setup>
import Content from './Content.vue'
</script>

<style scoped>
.show-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}
</style>
