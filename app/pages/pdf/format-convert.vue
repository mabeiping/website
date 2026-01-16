<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF格式转换</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">📄</div>
            <div class="upload-text">
              <p>点击选择PDF文件</p>
              <p class="upload-hint">支持PDF格式，最大10MB</p>
            </div>
          </label>
        </div>
        
        <div v-if="selectedFile" class="file-info">
          <p>已选择文件: {{ selectedFile.name }}</p>
          <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
        </div>
      </div>
      
      <div class="conversion-options">
        <h3>转换格式</h3>
        <div class="options-grid">
          <button 
            v-for="format in targetFormats" 
            :key="format.value"
            class="format-button"
            :class="{ active: selectedFormat === format.value }"
            @click="selectedFormat = format.value"
          >
            {{ format.label }}
          </button>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleConvert" :disabled="!selectedFile || !selectedFormat">
          开始转换
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="conversionResult" class="result-area">
        <h3>转换结果</h3>
        <div class="result-message">
          <p>{{ conversionResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF格式转换工具可以将PDF文件转换为其他格式，或从其他格式转换为PDF。</p>
      <ul>
        <li>支持PDF转Word、Excel、PPT、HTML、TXT、JPG、PNG等格式</li>
        <li>支持Word、Excel、PPT、HTML、TXT、JPG、PNG等格式转PDF</li>
        <li>保持原文档的格式和排版</li>
        <li>批量转换多个文件</li>
        <li>转换后可直接下载</li>
      </ul>
      <div class="notice">
        <p><strong>注意：</strong>此功能需要后端服务器支持。当前为前端演示界面。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const selectedFormat = ref('')
const conversionResult = ref('')

const targetFormats = [
  { value: 'word', label: 'Word (DOCX)' },
  { value: 'excel', label: 'Excel (XLSX)' },
  { value: 'ppt', label: 'PowerPoint (PPTX)' },
  { value: 'html', label: 'HTML' },
  { value: 'txt', label: 'TXT' },
  { value: 'jpg', label: 'JPG图片' },
  { value: 'png', label: 'PNG图片' }
]

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB')
      return
    }
    selectedFile.value = file
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleConvert = () => {
  if (!selectedFile.value || !selectedFormat.value) {
    alert('请选择文件和目标格式')
    return
  }
  
  // 这里应该是实际的转换逻辑，需要后端支持
  conversionResult.value = `文件 "${selectedFile.value.name}" 已转换为 ${targetFormats.find(f => f.value === selectedFormat.value)?.label} 格式（演示模式）`
}

const reset = () => {
  selectedFile.value = null
  selectedFormat.value = ''
  conversionResult.value = ''
  document.getElementById('pdf-file').value = ''
}
</script>

<style scoped>
.pdf-tool-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.tool-container {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.upload-area {
  margin-bottom: 2rem;
}

.upload-box {
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-box:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.upload-label {
  cursor: pointer;
  display: block;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text p {
  margin: 0.5rem 0;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.file-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
}

.file-info p {
  margin: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.conversion-options {
  margin-bottom: 2rem;
}

.conversion-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.format-button {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.format-button:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.format-button.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.action-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-button {
  flex: 1;
  padding: 1rem 2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.action-button.secondary:hover {
  background-color: var(--color-gray-300);
}

.result-area {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.result-area h3 {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.result-message {
  color: var(--color-text-secondary);
}

.tool-info {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.tool-info h2 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.tool-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.tool-info ul {
  list-style: none;
  padding: 0;
}

.tool-info li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.tool-info li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.notice {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--color-accent);
  background-color: rgba(245, 158, 11, 0.1);
  border-left: 4px solid var(--color-accent);
  border-radius: 4px;
}

.notice p {
  margin: 0;
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .pdf-tool-page {
    padding: 1rem;
  }
  
  .options-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .action-area {
    flex-direction: column;
  }
}
</style>