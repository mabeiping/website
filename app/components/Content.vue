<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <div class="content">
      <div class="main-content-area">
        <!-- 首页内容 -->
        <div class="home-content">
          <!-- 网站介绍 -->
          <div class="website-intro">
            <p class="intro-text">
              我们提供一系列简洁高效的工具集，涵盖职场办公软件和前端开发工具两大类别，
              旨在帮助用户提升工作效率，简化复杂任务，让工作与开发更加轻松便捷。
            </p>
          </div>
          
          <!-- 工具分类展示 -->
          <div class="tool-categories">
            <div v-for="(category, index) in toolCategories" :key="index" class="tool-category">
              <h3 class="category-title">
                {{ category.name }}
              </h3>
              <div class="tool-grid">
                <ToolCard 
                  v-for="(tool, toolIndex) in category.tools" 
                  :key="toolIndex" 
                  :tool="tool" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 内容区与页脚分隔线 -->
        <div class="footer-separator"></div>
        
        <!-- 页脚栏 -->
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Footer from '../components/Footer.vue'
import Icon from '../components/Icon.vue'
import ToolCard from '../components/ToolCard.vue'
import siteConfig from '../config/siteConfig'

// 从配置文件中获取相关配置
const toolCategories = siteConfig.toolCategories


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
  background-color: var(--color-bg-secondary);
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--color-border);
}

.intro-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text-primary);
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
  gap: 0.5rem;
}

.tool-category {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.25s ease;
  border: 1px solid var(--color-border);
}

.category-title {
  font-size: 1.15rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1.5px solid var(--color-border);
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* 工具网格样式 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.5rem;
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

/* 暗色主题样式已集成到CSS变量中，无需单独定义 */
</style>
