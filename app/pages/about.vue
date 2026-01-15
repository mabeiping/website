<template>
  <div class="about-page">
    <h1 class="page-title">关于我们</h1>
    
    <div class="about-content">
      <section class="about-section">
        <h2>🎯 网站简介</h2>
        <p>
          小马Office工具站是一个专注于提供高效实用工具的在线平台，旨在帮助用户提升工作效率，简化复杂任务。
          我们致力于为开发者、办公人员和普通用户提供简洁易用的工具集，涵盖职场办公、前端开发和休闲游戏等多个领域。
        </p>
      </section>
      
      <section class="about-section">
        <h2>🌟 我们的优势</h2>
        <ul class="advantages-list">
          <li>简洁直观的用户界面，无需注册即可使用所有工具</li>
          <li>提供多种实用工具，满足不同场景需求</li>
          <li>响应式设计，支持各种设备访问</li>
          <li>免费使用，持续更新和优化</li>
          <li>重视用户体验，不断改进产品功能</li>
        </ul>
      </section>
      
      <section class="about-section">
        <h2>📚 工具分类</h2>
        <p>
          我们的工具分为三大类：职场办公软件、前端开发工具和碎片时间小游戏。
          每类工具都经过精心设计，旨在为用户提供最佳的使用体验。
        </p>
      </section>
      
      <section class="about-section">
        <h2>🤝 联系我们</h2>
        <p>
          如果您有任何建议或问题，欢迎随时联系我们。
          我们将竭诚为您服务，不断改进我们的产品和服务。
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  color: #1e88e5;
  margin-bottom: 2rem;
  text-align: center;
}

.about-content {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.about-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.about-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.about-section h2 {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.about-section p {
  color: #6c757d;
  line-height: 1.8;
  font-size: 1.05rem;
}

.advantages-list {
  list-style: none;
  padding: 0;
}

.advantages-list li {
  color: #6c757d;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
}

.advantages-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #1e88e5;
  font-weight: bold;
}
</style>