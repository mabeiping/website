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

<style scoped lang="scss">
@import '../styles/Footer.scss';
</style>