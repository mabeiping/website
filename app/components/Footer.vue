<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 网站简介 -->
      <div class="footer-column">
        <h3 class="footer-title">关于我们</h3>
        <p class="footer-description">{{ footerConfig.description }}</p>
      </div>
      
  
    </div>
    
  
  </footer>
</template>

<script setup>
import siteConfig from '../config/siteConfig'

// 从配置文件中获取页脚配置
const footerConfig = siteConfig.footer
</script>

<style scoped>
/* 页脚栏样式 */
.footer {
  background-color: white;
  color: #000000;
  padding: 2rem 0 1.5rem;
  margin-top: auto;
  
}

/* 页脚容器 */
.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  
}

/* 页脚列 */
.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 页脚标题 */
.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000000;
  margin: 0;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid #e0e0e0;
  display: inline-block;
}

/* 页脚描述 */
.footer-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #666666;
  margin: 0;
}

/* 页脚列表 */
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* 页脚列表项 */
.footer-list-item {
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 页脚链接 */
.footer-link {
  color: #666666;
  text-decoration: none;
  transition: color 0.3s ease, margin-left 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #1e88e5;
  margin-left: 0.3rem;
}

/* 页脚底部 */
.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1.5rem;
}

/* 版权信息 */
.copyright-text {
  font-size: 0.9rem;
  color: #888888;
  margin: 0;
  text-align: center;
}

/* 暗色主题样式 */
.dark-theme .footer {
  background-color: #2d2d2d;
  border-top-color: #404040;
  color: #e0e0e0;
}

.dark-theme .footer-container {
  border-bottom-color: #404040;
}

.dark-theme .footer-title {
  color: #e0e0e0;
  border-bottom-color: #404040;
}

.dark-theme .footer-description {
  color: #b0b0b0;
}

.dark-theme .footer-link {
  color: #b0b0b0;
}

.dark-theme .footer-link:hover {
  color: #1e88e5;
}

.dark-theme .copyright-text {
  color: #888888;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .footer-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 1.5rem 0 1rem;
  }
  
  .footer-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
  
  .footer-title {
    font-size: 1rem;
  }
  
  .footer-description,
  .footer-list-item {
    font-size: 0.9rem;
  }
  
  .copyright-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }
  
  .footer-column {
    gap: 0.8rem;
  }
  
  .footer-title {
    font-size: 0.95rem;
  }
  
  .footer-description,
  .footer-list-item {
    font-size: 0.85rem;
  }
}
</style>