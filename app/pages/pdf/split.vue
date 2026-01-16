<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF拆分</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">✂️</div>
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
      
      <div class="split-options">
        <h3>拆分方式</h3>
        <div class="split-method">
          <label class="radio-label">
            <input type="radio" v-model="splitMethod" value="pages" />
            <span>按页码拆分</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="splitMethod" value="each" />
            <span>每页拆分为独立文件</span>
          </label>
        </div>
        
        <div v-if="splitMethod === 'pages'" class="pages-input">
          <label>页码范围（例如：1-5, 8-10, 15）:</label>
          <input 
            type="text" 
            v-model="pageRanges" 
            placeholder="1-5, 8-10, 15"
            class="text-input"
          />
          <p class="input-hint">用逗号分隔多个范围，支持单个页码或页码范围</p>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleSplit" :disabled="!selectedFile || (splitMethod === 'pages' && !pageRanges)">
          开始拆分
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="splitResult" class="result-area">
        <h3>拆分结果</h3>
        <div class="result-message">
          <p>{{ splitResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF拆分工具可以将一个PDF文件拆分为多个PDF文件。</p>
      <ul>
        <li>支持按页码范围拆分（如：1-5, 8-10）</li>
        <li>支持每页拆分为独立文件</li>
        <li>可自定义拆分规则</li>
        <li>拆分后可直接下载</li>
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
const splitMethod = ref('pages')
const pageRanges = ref('')
const splitResult = ref('')

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

const handleSplit = () => {
  if (!selectedFile.value) {
    alert('请选择PDF文件')
    return
  }
  
  if (splitMethod.value === 'pages' && !pageRanges.value) {
    alert('请输入页码范围')
    return
  }
  
  // 这里应该是实际的拆分逻辑，需要后端支持
  if (splitMethod.value === 'each') {
    splitResult.value = `已将 "${selectedFile.value.name}" 按每页拆分为独立文件（演示模式）`
  } else {
    splitResult.value = `已将 "${selectedFile.value.name}" 按页码范围 "${pageRanges.value}" 拆分（演示模式）`
  }
}

const reset = () => {
  selectedFile.value = null
  splitMethod.value = 'pages'
  pageRanges.value = ''
  splitResult.value = ''
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

.split-options {
  margin-bottom: 2rem;
}

.split-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.split-method {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.radio-label:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-label input[type="radio"]:checked + span {
  color: var(--color-primary);
  font-weight: 600;
}

.pages-input {
  margin-top: 1rem;
}

.pages-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input-hint {
  margin-top: 0.5rem;
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