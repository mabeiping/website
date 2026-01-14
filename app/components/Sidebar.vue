<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <h3>工具分类</h3>
      <ul class="sidebar-menu">
        <li class="sidebar-item">
          <button class="sidebar-title" @click="toggleExpand('regex')">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems?.regex" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>正则表达式工具</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems?.regex">
            <li><NuxtLink to="/regex/extract">正则表达式提取</NuxtLink></li>
            <li><NuxtLink to="/regex/test">正则表达式测试</NuxtLink></li>
            <li><NuxtLink to="/regex/generate">正则表达式生成</NuxtLink></li>
            <li><NuxtLink to="/regex/replace">正则表达式替换</NuxtLink></li>
          </ul>
        </li>
        <li class="sidebar-item">
          <button class="sidebar-title" @click="toggleExpand('text')">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems?.text" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>文本处理工具</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems?.text">
            <li><NuxtLink to="/text/extract">文本提取</NuxtLink></li>
            <li><NuxtLink to="/text/replace">文本替换</NuxtLink></li>
            <li><NuxtLink to="/text/format">文本格式化</NuxtLink></li>
            <li><NuxtLink to="/text/split">文本分割与合并</NuxtLink></li>
          </ul>
        </li>
        <li class="sidebar-item">
          <button class="sidebar-title" @click="toggleExpand('encode')">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems?.encode" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>编码转换工具</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems?.encode">
            <li><NuxtLink to="/encode/base64">Base64 编码/解码</NuxtLink></li>
            <li><NuxtLink to="/encode/url">URL 编码/解码</NuxtLink></li>
            <li><NuxtLink to="/encode/html">HTML 实体转换</NuxtLink></li>
          </ul>
        </li>
        <li class="sidebar-item">
          <button class="sidebar-title" @click="toggleExpand('json')">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems?.json" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>JSON 工具</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems?.json">
            <li><NuxtLink to="/json/format">JSON 格式化</NuxtLink></li>
            <li><NuxtLink to="/json/compress">JSON 压缩</NuxtLink></li>
            <li><NuxtLink to="/json/convert">JSON 转其他格式</NuxtLink></li>
          </ul>
        </li>
        <li class="sidebar-item">
          <button class="sidebar-title" @click="toggleExpand('time')">
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline v-if="!expandedItems?.time" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
            <span>时间日期工具</span>
          </button>
          <ul class="sub-menu" v-if="expandedItems?.time">
            <li><NuxtLink to="/time/timestamp">时间戳转换</NuxtLink></li>
            <li><NuxtLink to="/time/calc">日期计算</NuxtLink></li>
            <li><NuxtLink to="/time/timezone">时区转换</NuxtLink></li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

// 侧边栏展开状态 - 第一个默认展开，其他默认折叠
const expandedItems = ref({
  regex: true,
  text: false,
  encode: false,
  json: false,
  time: false
})

// 切换侧边栏项展开/折叠
const toggleExpand = (item) => {
  expandedItems.value[item] = !expandedItems.value[item]
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  position: fixed;
  top: 80px;
  left: 0;
  width: 220px;
  background-color: white;
  padding: 1rem;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  height: calc(100vh - 80px);
  z-index: 50;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.sidebar h3 {
  margin-bottom: 1rem;
  color: #000000;
  font-size: 1.25rem;
  font-weight: 700;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.sidebar-menu {
  list-style: none;
}

.sidebar-item {
  margin-bottom: 0.125rem;
}

/* 侧边栏标题按钮样式 */
.sidebar-title {
  background: none;
  border: none;
  color: #000000;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.sidebar-title:hover {
  background-color: #f5f5f5;
}

.sidebar-title:focus {
  outline: none;
}

/* 箭头图标样式 */
.arrow-icon {
  color: #000000;
}

/* 子菜单样式 */
.sub-menu {
  list-style: none;
  margin: 0.125rem 0 0.125rem 1rem;
  padding: 0;
}

.sub-menu li {
  margin-bottom: 0.125rem;
}

.sub-menu a {
  color: #000000;
  text-decoration: none;
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.85rem;
}

.sub-menu a:hover {
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .sidebar {
    display: none;
  }
}

@media (max-width: 1024px) {
  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
    box-shadow: none;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

/* 暗色主题样式 */
.dark-theme .sidebar {
  background-color: #2d2d2d;
  border-right-color: #404040;
}

.dark-theme .sidebar h3 {
  color: #e0e0e0;
  border-bottom-color: #404040;
}

.dark-theme .sidebar-title {
  color: #e0e0e0;
}

.dark-theme .sidebar-title:hover {
  background-color: #404040;
}

.dark-theme .arrow-icon {
  color: #e0e0e0;
}

.dark-theme .sub-menu a {
  color: #a0a0a0;
}

.dark-theme .sub-menu a:hover {
  color: #e0e0e0;
  background-color: #404040;
}
</style>