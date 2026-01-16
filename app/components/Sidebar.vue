<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <h3>工具分类</h3>
      <ul class="sidebar-menu">
        <li class="sidebar-item" v-for="(category, index) in toolCategories" :key="index">
          <button class="sidebar-title" @click="toggleExpand(index)">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems[index]" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>{{ category.name }}</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems[index]">
            <li v-for="(tool, toolIndex) in category.tools" :key="toolIndex">
              <NuxtLink :to="tool.path" :class="{ 'router-link-active': route.path === tool.path }">{{ tool.name }}</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import siteConfig from '../config/siteConfig.js'

// 获取路由（Nuxt 3 自动导入 useRoute）
const route = useRoute()

// 从配置文件获取工具分类
const toolCategories = siteConfig.toolCategories

// 侧边栏展开状态 - 第一个默认展开，其他默认折叠
const expandedItems = ref({})

// 初始化展开状态
onMounted(() => {
  // 设置第一个分类默认展开，其他折叠
  toolCategories.forEach((category, index) => {
    expandedItems.value[index] = index === 0
  })
})

// 切换侧边栏项展开/折叠
const toggleExpand = (index) => {
  expandedItems.value[index] = !expandedItems.value[index]
}

// 处理工具点击事件，实现对应div的闪烁效果
const handleToolClick = (toolId) => {
  // 延迟执行，确保页面滚动完成后再执行闪烁效果
  setTimeout(() => {
    const targetElement = document.getElementById(toolId)
    if (targetElement) {
      // 添加闪烁类
      targetElement.classList.add('tool-card-flash')
      
      // 1.5秒后移除闪烁类
      setTimeout(() => {
        targetElement.classList.remove('tool-card-flash')
      }, 1500)
    }
  }, 100)
}
</script>

<style>
@import '../styles/Sidebar.css';
</style>