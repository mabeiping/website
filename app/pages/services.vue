<template>
  <div class="services-page">
  
  </div>
</template>

<style scoped>
.services-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  color: #1e88e5;
  margin-bottom: 2rem;
  text-align: center;
}

.services-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.service-card {
  display: flex;
  gap: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  align-items: flex-start;
}

.service-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}

.service-icon {
  color: #1e88e5;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.service-info {
  flex: 1;
}

.service-info h2 {
  font-size: 1.3rem;
  color: #343a40;
  margin-bottom: 0.5rem;
}

.service-info p {
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .service-card {
    flex-direction: column;
    text-align: center;
  }
  
  .service-icon {
    margin: 0 auto 1rem;
  }
}
</style>