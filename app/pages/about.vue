<template>
  <div class="about-page">
    关于页面
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