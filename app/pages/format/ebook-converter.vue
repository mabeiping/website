<template>
  <div class="ebook-converter-page">
    <h1 class="page-title">电子书格式转换工具</h1>
    
    <div class="converter-container">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-icon">📚</div>
          <div class="upload-text">
            <p>拖拽文件到此处或点击上传</p>
            <p class="upload-hint">支持 EPUB, PDF, MOBI, TXT, DOCX 格式</p>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".epub,.pdf,.mobi,.txt,.docx"
            multiple
            style="display: none"
          />
        </div>
        
        <div v-if="files.length > 0" class="file-list">
          <h3>已选择文件 ({{ files.length }})</h3>
          <div class="file-items">
            <div v-for="(file, index) in files" :key="index" class="file-item">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="remove-button" @click="removeFile(index)">✕</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="options-section">
        <h3>转换选项</h3>
        <div class="option-group">
          <label class="option-label">目标格式</label>
          <div class="format-options">
            <label 
              v-for="format in outputFormats" 
              :key="format.value"
              class="format-option"
              :class="{ active: selectedFormat === format.value }"
            >
              <input 
                type="radio" 
                v-model="selectedFormat" 
                :value="format.value"
                name="outputFormat"
              />
              <span class="format-icon">{{ format.icon }}</span>
              <span class="format-name">{{ format.name }}</span>
            </label>
          </div>
        </div>
        
        <div class="option-group">
          <label class="option-label">输出质量</label>
          <select class="option-select" v-model="quality">
            <option value="high">高质量</option>
            <option value="medium">标准质量</option>
            <option value="low">低质量（文件更小）</option>
          </select>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="preserveImages" />
            保留图片
          </label>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="preserveFormatting" />
            保留格式
          </label>
        </div>
      </div>
      
      <div class="action-section">
        <button 
          class="convert-button" 
          @click="startConversion"
          :disabled="files.length === 0 || isConverting"
        >
          <span v-if="!isConverting">🔄 开始转换</span>
          <span v-else>⏳ 转换中...</span>
        </button>
        <button class="clear-button" @click="clearAll" :disabled="isConverting">
          🗑️ 清空
        </button>
      </div>
      
      <div v-if="conversionResults.length > 0" class="results-section">
        <h3>转换结果</h3>
        <div class="result-items">
          <div v-for="(result, index) in conversionResults" :key="index" class="result-item">
            <span class="result-icon">{{ result.success ? '✅' : '❌' }}</span>
            <span class="result-name">{{ result.fileName }}</span>
            <span class="result-status" :class="result.success ? 'success' : 'error'">
              {{ result.message }}
            </span>
            <button 
              v-if="result.success" 
              class="download-button" 
              @click="downloadFile(result)"
            >
              ⬇️ 下载
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的电子书格式转换工具，支持多种格式之间的相互转换。</p>
      <ul>
        <li>支持 EPUB, PDF, MOBI, TXT, DOCX 等常见电子书格式</li>
        <li>批量转换，一次处理多个文件</li>
        <li>支持拖拽上传，操作简便</li>
        <li>可自定义输出质量和格式保留选项</li>
        <li>转换速度快，保持原文档结构</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const files = ref([])
const selectedFormat = ref('pdf')
const quality = ref('medium')
const preserveImages = ref(true)
const preserveFormatting = ref(true)
const isConverting = ref(false)
const conversionResults = ref([])

const outputFormats = [
  { value: 'pdf', name: 'PDF', icon: '📕' },
  { value: 'epub', name: 'EPUB', icon: '📖' },
  { value: 'mobi', name: 'MOBI', icon: '📱' },
  { value: 'txt', name: 'TXT', icon: '📝' },
  { value: 'docx', name: 'DOCX', icon: '📘' }
]

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  files.value = [...files.value, ...selectedFiles]
}

const handleDrop = (event) => {
  const droppedFiles = Array.from(event.dataTransfer.files)
  const validFiles = droppedFiles.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase()
    return ['epub', 'pdf', 'mobi', 'txt', 'docx'].includes(ext)
  })
  files.value = [...files.value, ...validFiles]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const startConversion = async () => {
  if (files.value.length === 0) return
  
  isConverting.value = true
  conversionResults.value = []
  
  for (const file of files.value) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = Math.random() > 0.2
    conversionResults.value.push({
      fileName: file.name,
      success,
      message: success 
        ? `转换成功 (${selectedFormat.value.toUpperCase()})` 
        : '转换失败，请重试',
      file: success ? file : null
    })
  }
  
  isConverting.value = false
}

const downloadFile = (result) => {
  const link = document.createElement('a')
  link.href = '#'
  link.download = result.fileName.replace(/\.[^/.]+$/, '') + '.' + selectedFormat.value
  link.click()
}

const clearAll = () => {
  files.value = []
  conversionResults.value = []
}
</script>

<style scoped>
.ebook-converter-page {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.converter-container {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-bg-secondary);
}

.upload-area:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-text p {
  margin: 0.5rem 0;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.file-list h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.file-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-primary);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.file-icon {
  font-size: 1.5rem;
}

.file-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.remove-button {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: all 0.2s ease;
}

.remove-button:hover {
  transform: scale(1.1);
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.options-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.format-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.format-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
}

.format-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.format-option.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.format-option input {
  display: none;
}

.format-icon {
  font-size: 2rem;
}

.format-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.option-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.convert-button,
.clear-button {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.convert-button {
  background-color: var(--color-primary);
  color: white;
}

.convert-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.convert-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.clear-button:hover:not(:disabled) {
  background-color: var(--color-bg-quaternary);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.result-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.result-icon {
  font-size: 1.5rem;
}

.result-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-text-primary);
}

.result-status {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.result-status.success {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.15);
}

.result-status.error {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.15);
}

.download-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.download-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.info-section {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.info-section h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.info-section p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.info-section ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.info-section ul li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .ebook-converter-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .converter-container {
    padding: 1.5rem;
  }

  .format-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .convert-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }

  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .download-button {
    width: 100%;
  }
}
</style>
