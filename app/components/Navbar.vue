<template>
  <header class="navbar">
    <div class="navbar-content">
      <!-- Logo区域 -->
      <NuxtLink to="/" class="logo-link" aria-label="返回首页">
        <div class="logo">
          <img src="/favicon.ico" alt="网站图标" class="logo-img">
          <h1 class="logo-text">小马Office工具站</h1>
        </div>
      </NuxtLink>
      
      <!-- 中间区域：工具分类下拉菜单 + 搜索框 -->
      <div class="navbar-center">
        <!-- 工具分类下拉菜单 -->
        <div class="category-dropdown" ref="dropdownRef">
          <button class="dropdown-trigger" @click="toggleDropdown" :class="{ 'active': isDropdownOpen }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>工具分类</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-arrow">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          <!-- 下拉菜单内容 -->
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <div v-for="(category, index) in toolCategories" :key="index" class="dropdown-category">
              <div class="category-name">{{ category.name }}</div>
              <div class="category-tools">
                <NuxtLink v-for="(tool, toolIndex) in category.tools" :key="toolIndex" :to="tool.path" class="tool-link" @click="isDropdownOpen = false">
                  {{ tool.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索工具..." 
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>
      </div>
      
      <!-- 右侧区域：主题切换按钮 -->
      <div class="navbar-right">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
      
      <!-- 下拉菜单背景遮罩 -->
      <div v-if="isDropdownOpen" class="dropdown-overlay" @click="isDropdownOpen = false"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import siteConfig from '../config/siteConfig.js'

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggleTheme'])

const isDropdownOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref(null)

const toolCategories = siteConfig.toolCategories

const toggleTheme = () => {
  emit('toggleTheme')
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleSearch = (e) => {
  searchQuery.value = e.target.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>
@import '../styles/Navbar.css';
</style>
