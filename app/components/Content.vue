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
      效实用的在线工具，涵盖正则表达式、文本处理、编码转换、JSON处理和时间日期计算等多个领域,
              旨在帮助开发者和办公人员提升工作效率，简化复杂任务，让工作更轻松。
            </p>
          </div>
          
          <!-- 工具分类展示 -->
          <div class="tool-categories">
            <div v-for="category in toolCategories" :key="category.id" class="tool-category" :id="category.id">
              <h3 class="category-title">
                {{ category.name }}
              </h3>
              <div class="tool-grid">
                <ToolCard 
                  v-for="tool in category.tools" 
                  :key="tool.id" 
                  :tool="tool" 
                />
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
      <!-- <ProfileAside /> -->
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ProfileAside from './ProfileAside.vue'
import Icon from './Icon.vue'
import ToolCard from './ToolCard.vue'
import siteConfig from '../config/siteConfig.js'

// 从配置文件获取工具分类列表
const toolCategories = siteConfig.toolCategories
</script>

<style lang="scss">
@import '../styles/Content.scss';
</style>