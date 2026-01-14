<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <section class="content">
      <div class="main-content-area">
        <!-- 首页内容 -->
        <div class="home-content">
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
        <Footer />
      </div>
    </section>
    
    <!-- 个人简介区域 - 独立在section之外 -->
    <ProfileAside />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProfileAside from '../components/ProfileAside.vue'
import Footer from '../components/Footer.vue'
import siteConfig from '../config/siteConfig'

// 从配置文件中获取相关配置
const toolCategories = siteConfig.toolCategories

// 添加首页类
onMounted(() => {
  document.body.classList.add('home-page')
})

// 移除首页类
onUnmounted(() => {
  document.body.classList.remove('home-page')
})
</script>

<style scoped>
/* 页面容器样式 */
.page-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 内容栏样式 */
.content {
  background-color: white;
  padding: 1rem 2rem 1.5rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex: 1;
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

/* 主内容区域 */
.main-content-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 内容区与页脚分隔线 */
.footer-separator {
  height: 1px;
  background-color: #e0e0e0;
  margin: 1rem 0;
  width: 100%;
}



/* 首页内容样式 */
.home-content {
  flex: 1;
}

/* 网站介绍样式 */
.website-intro {
  background-color: #f8f9fa;
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  border: 1px solid #e0e0e0;
}

.intro-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #34495e;
  margin: 0;
}

/* 响应式设计 - 页面宽度低于1200px时 */
@media (max-width: 1200px) {
  .intro-text {
    font-size: 1rem;
    line-height: 1.4;
  }
}

@media (max-width: 768px) {
  .website-intro {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .intro-text {
    font-size: 1rem;
    line-height: 1.4;
  }
}

@media (max-width: 480px) {
  .website-intro {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .intro-text {
    font-size: 0.95rem;
  }
}

/* 工具分类展示样式 */
.tool-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tool-category {
  background-color: white;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-title {
  font-size: 1.1rem;
  color: #000000;
  margin-bottom: 0.6rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #e0e0e0;
}

/* 工具网格样式 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* 工具卡片样式 */
.tool-card {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.6rem;
  text-decoration: none;
  color: #000000;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
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
  font-size: 1.3rem;
  line-height: 1;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

/* 工具信息样式 */
.tool-info {
  flex: 1;
  width: 100%;
  min-width: 0;
}

/* 工具名称样式 */
.tool-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
  white-space: normal;
  word-wrap: break-word;
  overflow: visible;
}

/* 工具简介样式 */
.tool-desc {
  font-size: 0.7rem;
  color: #888888;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-container {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
  }
  
  .content {
    margin-left: 0;
    width: 100%;
    height: auto;
    min-height: 50vh;
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
    overflow-y: auto;
    height: auto;
  }
  
  .content {
    margin-left: 0;
    width: 100%;
    padding: 1rem;
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