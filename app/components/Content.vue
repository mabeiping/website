<template>
  <section class="content">
    <!-- 主内容区域 -->
    <div class="main-content-wrapper">
      <div class="main-content-area">
        <!-- 首页内容 -->
        <div class="home-content">
          <!-- <h1 class="page-title">欢迎使用网站名称</h1> -->
          <!-- 网站介绍 -->
          <div class="website-intro">
            <p class="intro-text">
              我们提供一系列简洁高效的办公工具，涵盖正则表达式、文本处理、编码转换、JSON处理和时间日期计算等多个领域，
              旨在帮助开发者和办公人员提升工作效率，简化复杂任务，让工作更轻松。
            </p>
          </div>
          
          <!-- 工具分类展示 -->
          <div class="tool-categories">
            <div v-for="category in toolCategories" :key="category.id" class="tool-category">
              <h3 class="category-title">
                {{ category.name }}
              </h3>
              <div class="tool-grid">
                <NuxtLink 
                  v-for="tool in category.tools" 
                  :key="tool.id" 
                  :to="tool.path" 
                  class="tool-card"
                >
                  <div class="tool-icon">{{ tool.icon }}</div>
                  <div class="tool-info">
                    <div class="tool-name">{{ tool.name }}</div>
                    <div class="tool-desc">{{ tool.desc }}</div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 内容区与页脚分隔线 -->
        <div class="footer-separator"></div>
        
        <!-- 页脚栏 -->
        <footer class="footer">
          <div class="footer-content">
            <p>&copy; 2024 网站名称. 保留所有权利.</p>
            <div class="footer-links">
              <a href="#">隐私政策</a>
              <a href="#">使用条款</a>
              <a href="#">联系方式</a>
            </div>
          </div>
        </footer>
      </div>
      
      <!-- 个人简介区域 -->
      <ProfileAside />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProfileAside from './ProfileAside.vue'

// 工具分类列表
const toolCategories = [
  {
    id: 'regex',
    name: '正则表达式工具',
    tools: [
      { id: 'regex-extract', name: '正则表达式提取', path: '/regex/extract', icon: '📋', desc: '提取匹配的文本内容' },
      { id: 'regex-test', name: '正则表达式测试', path: '/regex/test', icon: '✓', desc: '测试正则表达式匹配' },
      { id: 'regex-generate', name: '正则表达式生成', path: '/regex/generate', icon: '✨', desc: '生成常用正则表达式' },
      { id: 'regex-replace', name: '正则表达式替换', path: '/regex/replace', icon: '🔄', desc: '替换匹配的文本内容' }
    ]
  },
  {
    id: 'text',
    name: '文本处理工具',
    tools: [
      { id: 'text-extract', name: '文本提取', path: '/text/extract', icon: '📌', desc: '从文本中提取指定内容' },
      { id: 'text-replace', name: '文本替换', path: '/text/replace', icon: '🔁', desc: '替换文本中的特定内容' },
      { id: 'text-format', name: '文本格式化', path: '/text/format', icon: '🎨', desc: '美化文本格式' },
      { id: 'text-split', name: '文本分割与合并', path: '/text/split', icon: '🔗', desc: '分割或合并文本' }
    ]
  },
  {
    id: 'encode',
    name: '编码转换工具',
    tools: [
      { id: 'base64', name: 'Base64 编码/解码', path: '/encode/base64', icon: '🔢', desc: 'Base64编解码转换' },
      { id: 'url', name: 'URL 编码/解码', path: '/encode/url', icon: '🌐', desc: 'URL编解码转换' },
      { id: 'html', name: 'HTML 实体转换', path: '/encode/html', icon: '<>', desc: 'HTML实体转换' }
    ]
  },
  {
    id: 'json',
    name: 'JSON 工具',
    tools: [
      { id: 'json-format', name: 'JSON 格式化', path: '/json/format', icon: '🎯', desc: '美化JSON格式' },
      { id: 'json-compress', name: 'JSON 压缩', path: '/json/compress', icon: '🗜️', desc: '压缩JSON内容' },
      { id: 'json-convert', name: 'JSON 转其他格式', path: '/json/convert', icon: '🔄', desc: 'JSON转换为其他格式' }
    ]
  },
  {
    id: 'time',
    name: '时间日期工具',
    tools: [
      { id: 'timestamp', name: '时间戳转换', path: '/time/timestamp', icon: '🔢', desc: '时间戳转换为日期' },
      { id: 'date-calc', name: '日期计算', path: '/time/calc', icon: '📅', desc: '日期加减计算' },
      { id: 'timezone', name: '时区转换', path: '/time/timezone', icon: '🌍', desc: '不同时区转换' }
    ]
  }
]
</script>

<style scoped>
/* 内容栏样式 */
.content {
  background-color: white;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-left: 220px;
  width: calc(100% - 220px);
  height: calc(100vh - 80px);
  position: fixed;
  top: 80px;
  right: 0;
  /* 确保内容区滚动条样式一致 */
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #f0f0f0;
}

/* 自定义滚动条样式 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.content::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

/* 主内容包装器 - 使用flex布局包含主内容和个人简介 */
.main-content-wrapper {
  display: flex;
  gap: 2rem;
  flex: 1;
  min-height: 0;
}

/* 主内容区域 */
.main-content-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 个人简介区域 */
.profile-section {
  width: 320px;
  flex-shrink: 0;
}

.profile-container {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.8rem 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 2rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content-wrapper {
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .content {
    margin-left: 0;
    width: 100%;
    padding: 1.5rem;
  }
  
  .main-content-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .profile-container {
    padding: 1.2rem;
  }
}

/* 内容区与页脚分隔线 */
.footer-separator {
  height: 1px;
  background-color: #e0e0e0;
  margin: 1.5rem 0;
  width: 100%;
}

/* 页脚栏样式 */
.footer {
  background-color: white;
  color: #000000;
  padding: 1rem 0;
  margin-top: auto;
  border-top: 1px solid #e0e0e0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: #000000;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #666666;
}

/* 首页内容样式 */
.home-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* 网站介绍样式 */
.website-intro {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #34495e;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .website-intro {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }
  
  .intro-text {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }
}

@media (max-width: 480px) {
  .website-intro {
    padding: 1rem;
    margin-bottom: 1.2rem;
  }
  
  .intro-text {
    font-size: 0.95rem;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
}

/* 工具分类展示样式 */
.tool-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tool-category {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-title {
  font-size: 1.2rem;
  color: #000000;
  margin-bottom: 1rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid #e0e0e0;
}

/* 工具网格样式 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

/* 工具卡片样式 */
.tool-card {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem;
  text-decoration: none;
  color: #000000;
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  cursor: pointer;
}

.tool-card:hover {
  background-color: #e8f0fe;
  border-color: #1e88e5;
}

.tool-card:active {
  transform: translateY(0);
}

/* 工具图标样式 */
.tool-icon {
  font-size: 1.4rem;
  line-height: 1;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

/* 工具信息样式 */
.tool-info {
  flex: 1;
  min-width: 0;
}

/* 工具名称样式 */
.tool-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

/* 工具简介样式 */
.tool-desc {
  font-size: 0.725rem;
  color: #888888;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    height: auto;
  }
}

/* 暗色主题样式 */
.dark-theme .content {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.dark-theme .footer {
  background-color: #2d2d2d;
  border-top-color: #404040;
  color: #e0e0e0;
}

.dark-theme .footer-links a {
  color: #e0e0e0;
}

.dark-theme .footer-links a:hover {
  color: #a0a0a0;
}

.dark-theme .footer-separator {
  background-color: #404040;
}

.dark-theme .page-title {
  color: #e0e0e0;
}

.dark-theme .website-intro {
  background-color: #2d2d2d;
  border-color: #404040;
}

.dark-theme .intro-text {
  color: #b0b0b0;
}

.dark-theme .tool-category {
  background-color: #2d2d2d;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark-theme .category-title {
  color: #e0e0e0;
  border-bottom-color: #404040;
}

.dark-theme .tool-card {
  background-color: #2d2d2d;
  border-color: #404040;
  color: #e0e0e0;
}

.dark-theme .tool-card:hover {
  background-color: #3a3a3a;
  border-color: #1e88e5;
}

.dark-theme .tool-name {
  color: #e0e0e0;
}

.dark-theme .tool-desc {
  color: #666666;
}


</style>