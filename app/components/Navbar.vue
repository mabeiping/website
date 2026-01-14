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
          <NuxtLink to="/" class="nav-item" @click="isMobileMenuOpen = false">首页</NuxtLink>
         
          <NuxtLink to="/about" class="nav-item" @click="isMobileMenuOpen = false">关于</NuxtLink>
          <NuxtLink to="/contact" class="nav-item" @click="isMobileMenuOpen = false">联系我们</NuxtLink>
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

<style scoped>
/* 基础导航栏样式 */
.navbar {
  background-color: white;
  color: black;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

/* 导航栏内容容器 */
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
}

/* 导航栏右侧区域 */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Logo样式 */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0;
  transition: all 0.3s ease;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.1);
}

.logo-text {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 800;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

/* Logo链接样式 */
.logo-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
  cursor: pointer;
}

.logo-link:focus {
  outline: 2px solid #1e88e5;
  outline-offset: 2px;
  border-radius: 4px;
}

/* 桌面端导航菜单 */
.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  transition: all 0.3s ease;
}

/* 导航项样式 */
.nav-item {
  color: #000000;
  text-decoration: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  position: relative;
  display: inline-block;
  line-height: 1.4;
  letter-spacing: 0.2px;
  border-radius: 6px;
  transition: all 0.3s ease;
  transform: translateZ(0);
}

/* 导航项悬停效果 */
.nav-item:hover {
  color: #1e88e5;
  background-color: rgba(30, 136, 229, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.15);
}

/* 导航项下划线动画 */
.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #1e88e5;
  transition: all 0.3s ease;
  border-radius: 2px;
  transform: translateX(-50%);
}

.nav-item:hover::after {
  width: 80%;
  left: 50%;
}

/* 当前激活状态样式 */
.nav-item.router-link-active {
  color: #1e88e5;
  font-weight: 700;
  background-color: rgba(30, 136, 229, 0.12);
}

.nav-item.router-link-active::after {
  width: 80%;
  left: 50%;
}

/* 主题切换按钮 */
.theme-toggle {
  background: none;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #34495e;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.theme-toggle:hover {
  background-color: #f8f9fa;
  border-color: #1e88e5;
  color: #1e88e5;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.15);
}

.theme-toggle:active {
  transform: scale(0.95);
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-button {
  display: none;
  background: none;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #34495e;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.mobile-menu-button:hover {
  background-color: #f8f9fa;
  border-color: #1e88e5;
  color: #1e88e5;
  transform: scale(1.1);
}

.mobile-menu-button:active {
  transform: scale(0.95);
}

/* 移动端菜单背景遮罩 */
.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.3s ease;
}

/* 移动端菜单样式 */
@media (max-width: 768px) {
  .mobile-menu-button {
    display: flex;
  }
  
  .mobile-menu-overlay {
    display: block;
  }
  
  /* 隐藏桌面端菜单 */
  .nav-menu {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 80px;
    right: -100%;
    background-color: white;
    width: 85%;
    max-width: 320px;
    height: calc(100vh - 80px);
    padding: 1.5rem;
    gap: 0.8rem;
    align-items: stretch;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    z-index: 999;
    overflow-y: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0 0 0 12px;
  }
  
  /* 显示移动端菜单 */
  .nav-menu.show-mobile-menu {
    right: 0;
    animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* 移动端导航项样式 */
  .nav-item {
    font-size: 1.1rem;
    padding: 1rem 1.2rem;
    text-align: left;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .nav-item:hover {
    transform: translateX(8px);
  }
  
  /* 导航项下划线调整 */
  .nav-item::after {
    left: 20px;
    transform: none;
  }
  
  .nav-item:hover::after {
    left: 20px;
  }
  
  /* 优化移动端导航栏内容 */
  .navbar-content {
    padding: 0 1.2rem;
  }
  
  /* 简化移动端Logo */
  .logo-text {
    font-size: 1.2rem;
  }
  
  .logo-img {
    width: 32px;
    height: 32px;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .navbar-content {
    padding: 0 1.5rem;
  }
  
  .nav-menu {
    gap: 1.5rem;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .navbar-content {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1.1rem;
  }
  
  .logo-img {
    width: 28px;
    height: 28px;
  }
  
  .nav-menu {
    width: 90%;
  }
}

/* 动画效果 */
@keyframes slideInRight {
  from {
    right: -100%;
    opacity: 0;
  }
  to {
    right: 0;
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 暗色主题样式 */
.dark-theme .navbar {
  background-color: #2d2d2d;
  border-bottom-color: #404040;
  color: #e0e0e0;
}

.dark-theme .logo-text {
  color: #e0e0e0;
}

.dark-theme .nav-menu {
  background-color: #2d2d2d;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

.dark-theme .nav-item {
  color: #e0e0e0;
}

.dark-theme .nav-item:hover {
  color: #1e88e5;
  background-color: rgba(30, 136, 229, 0.15);
}

.dark-theme .nav-item::after {
  background-color: #1e88e5;
}

.dark-theme .nav-item.router-link-active {
  background-color: rgba(30, 136, 229, 0.2);
}

.dark-theme .theme-toggle {
  border-color: #404040;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.dark-theme .theme-toggle:hover {
  background-color: #404040;
  border-color: #1e88e5;
}

.dark-theme .mobile-menu-button {
  border-color: #404040;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.dark-theme .mobile-menu-button:hover {
  background-color: #404040;
  border-color: #1e88e5;
}

.dark-theme .mobile-menu-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>