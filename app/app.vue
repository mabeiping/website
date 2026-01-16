<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkMode }">
    <NuxtRouteAnnouncer />
    <Navbar :is-dark-mode="isDarkMode" @toggle-theme="toggleTheme" />
    <Sidebar />
    <main class="main-content">
      <!-- <ShowContent /> -->
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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  line-height: 1.5;
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
  /* 主色 - 极简商务风蓝色 */
  --color-primary: #165DFF;
  --color-primary-hover: #0E42D2;
  --color-primary-active: #0927B0;
  
  /* 辅助色 */
  --color-secondary: #F5F7FA;
  --color-secondary-hover: #E6E8EB;
  --color-accent: #165DFF;
  --color-accent-hover: #0E42D2;
  --color-danger: #FF4D4F;
  --color-danger-hover: #CF1322;
  
  /* 中性色 */
  --color-white: #ffffff;
  --color-gray-50: #F8F9FA;
  --color-gray-100: #E8ECF0;
  --color-gray-200: #D0D7DE;
  --color-gray-300: #A8B5C0;
  --color-gray-400: #7D8799;
  --color-gray-500: #5A6270;
  --color-gray-600: #434A54;
  --color-gray-700: #2D333B;
  --color-gray-800: #1F2329;
  --color-gray-900: #14171A;
  
  /* 文本颜色 */
  --color-text-primary: #2D333B;
  --color-text-secondary: #5A6270;
  --color-text-muted: #7D8799;
  --color-text-light: #A8B5C0;
  
  /* 背景颜色 */
  --color-bg-primary: #F8F9FA;
  --color-bg-secondary: #E8ECF0;
  --color-bg-tertiary: #D0D7DE;
  --color-bg-card: #FFFFFF;
  
  /* 边框颜色 */
  --color-border: #D0D7DE;
  --color-border-light: #E8ECF0;
  --color-border-dark: #A8B5C0;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

/* 暗色主题颜色 */
.dark-theme {
  /* 主色 */
  --color-primary: #4D7CFF;
  --color-primary-hover: #165DFF;
  --color-primary-active: #0E42D2;
  
  /* 辅助色 */
  --color-secondary: #2D3748;
  --color-secondary-hover: #3A4352;
  --color-accent: #4D7CFF;
  --color-accent-hover: #165DFF;
  --color-danger: #FF7875;
  --color-danger-hover: #FF4D4F;
  
  /* 文本颜色 */
  --color-text-primary: #E2E8F0;
  --color-text-secondary: #A0AEC0;
  --color-text-muted: #6B7280;
  --color-text-light: #4B5563;
  
  /* 背景颜色 */
  --color-bg-primary: #1A202C;
  --color-bg-secondary: #1E293B;
  --color-bg-tertiary: #2D3748;
  --color-bg-card: #1E293B;
  
  /* 边框颜色 */
  --color-border: #2D3748;
  --color-border-light: #1E293B;
  --color-border-dark: #3A4352;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.6);
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
  margin: 0;
  padding: 0;
  position: relative;
  margin-top: 64px;
  margin-left: 292px;
  min-height: calc(100vh - 64px);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  gap: 0;
  overflow: hidden;
}

/* 确保 NuxtPage 占据剩余空间 */
.main-content > * {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 确保所有div元素在暗色主题下都能正确显示 */
.dark-theme div {
  background-color: inherit;
  color: inherit;
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
  .main-content {
    margin-left: 292px;
  }
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
}
</style>