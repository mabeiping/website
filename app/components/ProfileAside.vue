<template>
  <aside v-if="$route.path === '/'" class="profile-section">
    <div class="profile-container">
      <!-- 圆形头像 -->
      <div class="avatar-container">
        <img :src="profileConfig.avatar" :alt="profileConfig.name" class="avatar">
      </div>
      
      <!-- 姓名显示 -->
      <h2 class="profile-name">{{ profileConfig.name }}</h2>
      
      <!-- 简短个人介绍 -->
      <div class="profile-intro">
        <div class="intro-badges">
          <span v-for="badge in profileConfig.badges" :key="badge" class="badge">
            {{ badge }}
          </span>
        </div>
      </div>
      
      <!-- 社交媒体链接 -->
      <div class="social-section">
        <h3 class="section-title">关注我们</h3>
        <div class="social-links">
          <a 
            v-for="(social, key) in socialConfig" 
            :key="key"
            :href="social.url" 
            :class="['social-link', key]" 
            target="_blank" 
            :aria-label="social.name"
          >
            <svg v-if="key === 'bilibili'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4v16h16V4H4zm6 14V8l6 3.5V18H10z"></path>
            </svg>
            <svg v-else-if="key === 'douyin'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 0 0-10 10c0 5.5 4.5 10 10 10s10-4.5 10-10S17.5 2 12 2zm4.5 14.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5z"></path>
              <circle cx="12" cy="12" r="4"></circle>
            </svg>
            <svg v-else-if="key === 'github'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>{{ social.name }}</span>
          </a>
        </div>
      </div>
      
      <!-- 微信公众号二维码 -->
      <div class="wechat-section">
        <h3 class="section-title">{{ wechatConfig.title }}</h3>
        <div class="qrcode-container">
          <img :src="wechatConfig.qrcode" :alt="wechatConfig.title" class="qrcode">
          <p class="qrcode-text">{{ wechatConfig.description }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import siteConfig from '../config/siteConfig'

// 从配置文件中获取相关配置
const profileConfig = siteConfig.profile
const socialConfig = siteConfig.social
const wechatConfig = siteConfig.wechat
</script>

<style scoped>
/* 个人简介区域 */
.profile-section {
  position: fixed;
  right: 20px;
  top: 90px;
  width: 280px;
  flex-shrink: 0;
  z-index: 90; /* 确保在侧边栏之上，但在导航栏之下 */
}

.profile-container {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 0.6rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: fit-content;
  text-align: center;
}

/* 头像样式 */
.avatar-container {
  margin-bottom: 0.4rem;
  display: flex;
  justify-content: center;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  background-color: #f0f0f0;
}

/* 姓名样式 */
.profile-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.3rem;
  line-height: 1.2;
}

/* 简介徽章 */
.profile-intro {
  margin-bottom: 0.6rem;
}

.intro-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
}

.badge {
  background-color: #e3f2fd;
  color: #1e88e5;
  padding: 0.2rem 0.65rem;
  border-radius: 18px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.badge:hover {
  background-color: #bbdefb;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(30, 136, 229, 0.2);
}

/* 社交媒体链接 */
.social-section {
  margin-bottom: 0.35rem;
  text-align: left;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.25rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #e0e0e0;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.8rem;
}

.social-link:hover {
  background-color: #f0f0f0;
  transform: translateX(4px);
}

.social-link svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 社交媒体特定颜色 */
.social-link.bilibili:hover {
  background-color: #f0f8ff;
  color: #00aeec;
}

.social-link.douyin:hover {
  background-color: #fff0f5;
  color: #fe2c55;
}

.social-link.github:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* 微信公众号二维码 */
.wechat-section {
  text-align: left;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.qrcode,
.qrcode-placeholder {
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  padding: 0.3rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
}

.qrcode-placeholder svg {
  width: 80px;
  height: 80px;
  color: #e0e0e0;
}

.qrcode-text {
  font-size: 0.75rem;
  color: #666666;
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .profile-section {
    display: none;
  }
}

/* 暗色主题样式 */
.dark-theme .profile-container {
  background-color: #2d2d2d;
  border-color: #404040;
}

.dark-theme .section-title {
  color: #e0e0e0;
  border-bottom-color: #404040;
}

.dark-theme .badge {
  background-color: #3a3a3a;
  color: #1e88e5;
}

.dark-theme .badge:hover {
  background-color: #4a4a4a;
}

.dark-theme .social-link {
  color: #e0e0e0;
}

.dark-theme .social-link:hover {
  background-color: #3a3a3a;
}

.dark-theme .qrcode-container {
  background-color: #3a3a3a;
  border-color: #404040;
}

.dark-theme .qrcode,
.dark-theme .qrcode-placeholder {
  background-color: #2d2d2d;
  border-color: #404040;
}

.dark-theme .qrcode-placeholder svg {
  color: #666666;
}

.dark-theme .qrcode-text {
  color: #b0b0b0;
}
</style>