<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkMode }">
    <NuxtRouteAnnouncer />
    <Navbar :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
    <main class="main-content">
      <Sidebar />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 日/夜间模式状态
const isDarkMode = ref(false)

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // 保存主题偏好到localStorage（仅在客户端）
  if (process.client) {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    // 添加主题切换动画效果
    document.documentElement.classList.add('theme-transition')
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
  }
}

// 初始化 - 仅在客户端执行
const initTheme = () => {
  // 从localStorage加载主题偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark'
  } else {
    // 默认根据系统主题
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
}

// 在组件挂载后初始化主题（仅在客户端）
onMounted(() => {
  initTheme()
  
  // 监听系统主题变化，平滑更新
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = (e) => {
    if (!localStorage.getItem('theme')) {
      // 只有在用户没有手动设置主题时，才跟随系统变化
      isDarkMode.value = e.matches
    }
  }
  
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  
  // 清理事件监听器
  return () => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})

// 监听主题变化，添加/移除HTML类名
watch(isDarkMode, (newValue) => {
  if (process.client) {
    if (newValue) {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }
}, { immediate: true })
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  /* 优化字体渲染 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-display: optional;
  /* 防止页面整体出现滚动条 */
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* 重置默认链接样式，避免加载时的蓝色下划线闪烁 */
a {
  color: inherit;
  text-decoration: none;
}

/* 统一色彩体系 - CSS变量定义 */
:root {
  /* 主色 */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-active: #1d4ed8;
  
  /* 辅助色 */
  --color-secondary: #10b981;
  --color-secondary-hover: #059669;
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-danger: #ef4444;
  --color-danger-hover: #dc2626;
  
  /* 中性色 */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* 文本颜色 */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-500);
  --color-text-light: var(--color-gray-400);
  
  /* 背景颜色 */
  --color-bg-primary: var(--color-white);
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-tertiary: var(--color-gray-100);
  --color-bg-card: var(--color-white);
  
  /* 边框颜色 */
  --color-border: var(--color-gray-200);
  --color-border-light: var(--color-gray-100);
  --color-border-dark: var(--color-gray-300);
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* 暗色主题颜色 */
.dark-theme {
  /* 主色 */
  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-primary-active: #2563eb;
  
  /* 辅助色 */
  --color-secondary: #34d399;
  --color-secondary-hover: #10b981;
  --color-accent: #fbbf24;
  --color-accent-hover: #f59e0b;
  --color-danger: #f87171;
  --color-danger-hover: #ef4444;
  
  /* 文本颜色 */
  --color-text-primary: var(--color-gray-100);
  --color-text-secondary: var(--color-gray-300);
  --color-text-muted: var(--color-gray-400);
  --color-text-light: var(--color-gray-500);
  
  /* 背景颜色 */
  --color-bg-primary: var(--color-gray-900);
  --color-bg-secondary: var(--color-gray-800);
  --color-bg-tertiary: var(--color-gray-700);
  --color-bg-card: var(--color-gray-800);
  
  /* 边框颜色 */
  --color-border: var(--color-gray-700);
  --color-border-light: var(--color-gray-800);
  --color-border-dark: var(--color-gray-600);
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.6), 0 8px 10px -6px rgb(0 0 0 / 0.6);
}

/* 主题切换时的平滑过渡 - 对所有元素的颜色相关属性过渡 */
.theme-transition * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

/* 优化文本选择 - 仅对非交互元素禁止选择 */
div:not(a) {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 允许特定元素文本可选中 */
a, input, textarea, code, pre, .tool-name, .intro-text, .category-title, .about-section, .calculator-info, .tool-card {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  cursor: pointer;
}

/* 确保NuxtLink可以正常点击 */
.nuxt-link-active, .nuxt-link-exact-active {
  cursor: pointer;
}

/* 确保导航项可以正常点击 */
.nav-item {
  cursor: pointer;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 确保工具卡片可以正常点击 */
.tool-card {
  cursor: pointer;
  pointer-events: auto;
}

/* 确保侧边栏项可以正常点击 */
.sidebar-title {
  cursor: pointer;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.sub-menu a {
  cursor: pointer;
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 优化主题切换按钮的视觉效果 */
.theme-toggle {
  transition: all 0.3s ease;
}

/* 优化工具卡片在不同主题下的显示效果 */
.dark-theme .tool-card {
  background-color: var(--color-bg-card);
  border-color: var(--color-border);
}

.dark-theme .tool-card:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

/* 优化网站介绍在暗色主题下的显示效果 */
.dark-theme .website-intro {
  background-color: var(--color-bg-secondary) !important;
  border-color: var(--color-border) !important;
}

.dark-theme .website-intro .intro-text {
  color: var(--color-text-primary) !important;
}

/* 优化分类标题在暗色主题下的显示效果 */
.dark-theme .category-title {
  color: var(--color-primary);
  border-bottom-color: var(--color-border);
}

/* 确保在暗色主题下，content section的背景颜色正确显示 */
.dark-theme section.content {
  background-color: var(--color-bg-primary) !important;
}

/* 优化导航链接的渲染性能 */
.nav-item {
  /* 使用CSS硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  /* 确保字体渲染一致 */
  font-synthesis: none;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主内容区样式 */
.main-content {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  margin-top: 80px; /* 避免被固定定位的导航栏遮挡 */
  min-height: calc(100vh - 80px);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* 确保所有div元素在暗色主题下都能正确显示 */
.dark-theme div {
  background-color: inherit;
  color: inherit;
}

/* NuxtPage 容器样式，确保不被 Sidebar 遮挡 */
.main-content > div {
  margin-left: 220px;
  margin-right: 20px;
  flex: 1;
  width: calc(100% - 220px - 20px);
  overflow: hidden;
}

/* 页面容器样式 - 全局 */
.page-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  /* 在中等屏幕上，移除侧边距 */
  .main-content > div {
    margin-right: 0;
    margin-left: 0;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    justify-content: flex-start;
  }
  
  /* 在小屏幕上，移除 NuxtPage 容器的 margin-left 和 margin-right */
  .main-content > div {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }
}
</style>