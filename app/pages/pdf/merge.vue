<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF合并</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-files" accept=".pdf" multiple @change="handleFilesSelect" style="display: none;">
          <label for="pdf-files" class="upload-label">
            <div class="upload-icon">📚</div>
            <div class="upload-text">
              <p>点击选择多个PDF文件</p>
              <p class="upload-hint">支持多选，每个文件最大10MB</p>
            </div>
          </label>
        </div>
        
        <div v-if="selectedFiles.length > 0" class="files-list">
          <h3>已选择文件 ({{ selectedFiles.length }})</h3>
          <div class="file-item" v-for="(file, index) in selectedFiles" :key="index">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <button class="remove-button" @click="removeFile(index)">×</button>
          </div>
          <div class="sort-controls">
            <button class="sort-button" @click="moveUp" :disabled="selectedIndex === null || selectedIndex === 0">↑</button>
            <button class="sort-button" @click="moveDown" :disabled="selectedIndex === null || selectedIndex === selectedFiles.length - 1">↓</button>
            <span class="sort-hint">点击文件后使用上下箭头调整顺序</span>
          </div>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleMerge" :disabled="selectedFiles.length < 2">
          合并PDF ({{ selectedFiles.length }}个文件)
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="mergeResult" class="result-area">
        <h3>合并结果</h3>
        <div class="result-message">
          <p>{{ mergeResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF合并工具可以将多个PDF文件合并为一个PDF文件。</p>
      <ul>
        <li>支持同时上传多个PDF文件</li>
        <li>可自定义文件合并顺序</li>
        <li>保持原文档的格式和排版</li>
        <li>合并后可直接下载</li>
      </ul>
      <div class="notice">
        <p><strong>注意：</strong>此功能需要后端服务器支持。当前为前端演示界面。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFiles = ref([])
const selectedIndex = ref(null)
const mergeResult = ref('')

const handleFilesSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) {
      alert(`文件 "${file.name}" 大小超过10MB，已跳过`)
      return
    }
    selectedFiles.value.push(file)
  })
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  } else if (selectedIndex.value > index) {
    selectedIndex.value--
  }
}

const moveUp = () => {
  if (selectedIndex.value === null || selectedIndex.value === 0) return
  const temp = selectedFiles.value[selectedIndex.value]
  selectedFiles.value[selectedIndex.value] = selectedFiles.value[selectedIndex.value - 1]
  selectedFiles.value[selectedIndex.value - 1] = temp
  selectedIndex.value--
}

const moveDown = () => {
  if (selectedIndex.value === null || selectedIndex.value === selectedFiles.value.length - 1) return
  const temp = selectedFiles.value[selectedIndex.value]
  selectedFiles.value[selectedIndex.value] = selectedFiles.value[selectedIndex.value + 1]
  selectedFiles.value[selectedIndex.value + 1] = temp
  selectedIndex.value++
}

const handleMerge = () => {
  if (selectedFiles.value.length < 2) {
    alert('请至少选择2个PDF文件')
    return
  }
  
  // 这里应该是实际的合并逻辑，需要后端支持
  mergeResult.value = `已成功合并 ${selectedFiles.value.length} 个PDF文件（演示模式）`
}

const reset = () => {
  selectedFiles.value = []
  selectedIndex.value = null
  mergeResult.value = ''
  document.getElementById('pdf-files').value = ''
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

.files-list {
  margin-top: 1.5rem;
}

.files-list h3 {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-item:hover {
  background-color: var(--color-bg-tertiary);
}

.file-name {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.file-size {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.remove-button {
  width: 24px;
  height: 24px;
  border: none;
  background-color: var(--color-danger);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  transition: all 0.3s ease;
}

.remove-button:hover {
  background-color: var(--color-danger-hover);
  transform: scale(1.1);
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--color-bg-tertiary);
  border-radius: 6px;
}

.sort-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-button:hover:not(:disabled) {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.sort-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sort-hint {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
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
  
  .action-area {
    flex-direction: column;
  }
}
</style>