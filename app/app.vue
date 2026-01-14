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
import { ref, onMounted } from 'vue'

// 日/夜间模式状态
const isDarkMode = ref(false)

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // 保存主题偏好到localStorage（仅在客户端）
  if (process.client) {
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
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
  
  // 检查当前时间
  checkMidnightHour()
  
  // 每小时检查一次时间
  setInterval(checkMidnightHour, 60 * 60 * 1000)
}

// 检查当前时间是否为午夜时段
const checkMidnightHour = () => {
  const now = new Date()
  const hour = now.getHours()
  // 午夜时段定义为22:00-06:00
  return hour >= 22 || hour < 6
}

// 在组件挂载后初始化主题（仅在客户端）
onMounted(() => {
  initTheme()
  
  // 监听系统主题变化，平滑更新
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // 只有在用户没有手动设置主题时，才跟随系统变化
      isDarkMode.value = e.matches
    }
  })
})
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
  color: #333;
  background-color: #f5f5f5;
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

/* 主题切换时的平滑过渡 - 只对颜色属性过渡，避免布局变化 */
.app-container {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
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

/* 优化主题切换时的背景色过渡 */
.dark-theme {
  background-color: #1a1a1a;
  color: #e0e0e0;
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
}

/* NuxtPage 容器样式，确保不被 Sidebar 遮挡 */
.main-content > div {
  margin-left: 220px;
  margin-right: 20px;
  flex: 1;
  width: calc(100% - 220px - 20px);
  overflow: hidden;
}

/* 首页样式 - 为固定定位的aside组件留出空间 */
.home-page .main-content > div {
  margin-right: 310px;
  width: calc(100% - 220px - 310px);
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
  
  /* 首页样式在小屏幕上不生效 */
  .home-page .main-content > div {
    margin-right: 0;
    width: 100%;
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