<template>
  <header class="navbar">
    <div class="navbar-content">
      <!-- Logo区域 - 仅支持点击交互 -->
      <NuxtLink to="/" class="logo-link" aria-label="返回首页">
        <div class="logo">
          <img src="/favicon.ico" alt="网站图标" class="logo-img">
          <h1 class="logo-text">小马Office工具站</h1>
        </div>
      </NuxtLink>
      
      <!-- 右侧区域：导航菜单 + 主题切换按钮 + 移动端汉堡菜单 -->
      <div class="navbar-right">
        <!-- 桌面端导航菜单 -->
        <nav class="nav-menu" :class="{ 'show-mobile-menu': isMobileMenuOpen }">
          <NuxtLink to="/" class="nav-item" @click="isMobileMenuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>网站首页</span>
          </NuxtLink>
         
         
        
          
          <NuxtLink to="/about" class="nav-item" @click="isMobileMenuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>关于我们</span>
          </NuxtLink>
          
    
        </nav>
        
        <!-- 日/夜间模式切换按钮 -->
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        
        <!-- 移动端汉堡菜单按钮 -->
        <button class="mobile-menu-button" @click="toggleMobileMenu" :aria-label="isMobileMenuOpen ? '关闭菜单' : '打开菜单'" aria-expanded="isMobileMenuOpen">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- 移动端菜单背景遮罩 -->
      <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="isMobileMenuOpen = false"></div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// 从父组件接收的props
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

// 向父组件发送的事件
const emit = defineEmits(['toggleTheme'])

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 切换主题事件
const toggleTheme = () => {
  emit('toggleTheme')
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style scoped lang="scss">
@import '../styles/Navbar.scss';
</style>