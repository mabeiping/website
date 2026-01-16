<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF压缩</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">🗜️</div>
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
      
      <div class="compress-options">
        <h3>压缩模式</h3>
        <div class="compress-modes">
          <label class="radio-label">
            <input type="radio" v-model="compressMode" value="quality" />
            <span>清晰优先（压缩约30%）</span>
            <p class="mode-desc">保持较高清晰度，文件大小适中</p>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="compressMode" value="size" />
            <span>大小优先（压缩约70%）</span>
            <p class="mode-desc">最大程度减小文件大小</p>
          </label>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleCompress" :disabled="!selectedFile">
          开始压缩
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="compressResult" class="result-area">
        <h3>压缩结果</h3>
        <div class="result-message">
          <p>{{ compressResult }}</p>
          <div v-if="compressedSize" class="size-comparison">
            <p>原始大小: {{ formatFileSize(originalSize) }}</p>
            <p>压缩后大小: {{ formatFileSize(compressedSize) }}</p>
            <p>压缩率: {{ compressionRatio }}%</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF压缩工具可以减小PDF文件的大小，方便存储和传输。</p>
      <ul>
        <li>支持清晰优先和大小优先两种压缩模式</li>
        <li>清晰优先：压缩约30%，保持较高清晰度</li>
        <li>大小优先：压缩约70%，最大程度减小文件</li>
        <li>压缩后可直接下载</li>
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
const compressMode = ref('quality')
const compressResult = ref('')
const originalSize = ref(0)
const compressedSize = ref(0)
const compressionRatio = ref(0)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB')
      return
    }
    selectedFile.value = file
    originalSize.value = file.size
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleCompress = () => {
  if (!selectedFile.value) {
    alert('请选择PDF文件')
    return
  }
  
  // 这里应该是实际的压缩逻辑，需要后端支持
  const ratio = compressMode.value === 'quality' ? 0.3 : 0.7
  compressedSize.value = Math.round(originalSize.value * (1 - ratio))
  compressionRatio.value = Math.round(ratio * 100)
  
  compressResult.value = `文件 "${selectedFile.value.name}" 已压缩（演示模式）`
}

const reset = () => {
  selectedFile.value = null
  compressMode.value = 'quality'
  compressResult.value = ''
  originalSize.value = 0
  compressedSize.value = 0
  compressionRatio.value = 0
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

.compress-options {
  margin-bottom: 2rem;
}

.compress-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.compress-modes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
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
  margin-right: 0.5rem;
}

.radio-label input[type="radio"]:checked ~ span {
  color: var(--color-primary);
  font-weight: 600;
}

.mode-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
  margin-left: 1.5rem;
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

.size-comparison {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-bg-tertiary);
  border-radius: 6px;
}

.size-comparison p {
  margin: 0.5rem 0;
  color: var(--color-text-primary);
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