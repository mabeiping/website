<template>
  <div class="contact-page">
    联系页面
     
    
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  color: #1e88e5;
  margin-bottom: 2rem;
  text-align: center;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact-icon {
  color: #1e88e5;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.contact-text h3 {
  font-size: 1.1rem;
  color: #343a40;
  margin-bottom: 0.25rem;
}

.contact-text p {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.6;
}

.contact-form-container h2 {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #343a40;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.submit-button {
  background-color: #1e88e5;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.submit-button:hover {
  background-color: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    order: 2;
  }
  
  .contact-form-container {
    order: 1;
  }
}
</style>