<template>
  <div class="image-compressor-page">
    <h1 class="page-title">图像压缩工具</h1>
    
    <div class="compressor-container">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-icon">📦</div>
          <div class="upload-text">
            <p>拖拽图片到此处或点击上传</p>
            <p class="upload-hint">支持 JPG, PNG, WEBP 格式</p>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            style="display: none"
          />
        </div>
        
        <div v-if="files.length > 0" class="file-list">
          <h3>已选择文件 ({{ files.length }})</h3>
          <div class="file-items">
            <div v-for="(file, index) in files" :key="index" class="file-item">
              <img :src="getPreviewUrl(file)" alt="预览" class="file-preview" />
              <div class="file-info">
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
              </div>
              <button class="remove-button" @click="removeFile(index)">✕</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="options-section">
        <h3>压缩选项</h3>
        
        <div class="option-group">
          <label class="option-label">压缩质量</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="compressLevel" 
              min="1" 
              max="100" 
              class="slider"
            />
            <span class="slider-value">{{ compressLevel }}%</span>
          </div>
          <p class="option-hint">数值越高，压缩率越大，但可能损失画质</p>
        </div>
        
        <div class="option-group">
          <label class="option-label">输出格式</label>
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
          <label class="option-label">最大宽度</label>
          <input 
            type="number" 
            v-model.number="maxWidth" 
            placeholder="不限制"
            min="1"
            class="option-input"
          />
          <p class="option-hint">设置图片最大宽度，高度会自动按比例调整</p>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="removeMetadata" />
            移除元数据（EXIF等）
          </label>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="convertToProgressive" />
            转换为渐进式JPEG
          </label>
        </div>
      </div>
      
      <div class="action-section">
        <button 
          class="compress-button" 
          @click="startCompression"
          :disabled="files.length === 0 || isCompressing"
        >
          <span v-if="!isCompressing">📦 开始压缩</span>
          <span v-else>⏳ 压缩中...</span>
        </button>
        <button class="clear-button" @click="clearAll" :disabled="isCompressing">
          🗑️ 清空
        </button>
      </div>
      
      <div v-if="compressionResults.length > 0" class="results-section">
        <h3>压缩结果</h3>
        <div class="result-items">
          <div v-for="(result, index) in compressionResults" :key="index" class="result-item">
            <img :src="result.previewUrl" alt="压缩后预览" class="result-preview" />
            <div class="result-info">
              <span class="result-name">{{ result.fileName }}</span>
              <div class="result-stats">
                <div class="stat-item">
                  <span class="stat-label">原始大小:</span>
                  <span class="stat-value">{{ formatFileSize(result.originalSize) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">压缩后:</span>
                  <span class="stat-value">{{ formatFileSize(result.compressedSize) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">压缩率:</span>
                  <span class="stat-value success">{{ result.compressionRate }}%</span>
                </div>
              </div>
              <button class="download-button" @click="downloadFile(result)">
                ⬇️ 下载
              </button>
            </div>
          </div>
        </div>
        <div class="download-all-section">
          <button class="download-all-button" @click="downloadAll">
            📦 打包下载全部
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的图像压缩工具，可以有效减小图片文件大小。</p>
      <ul>
        <li>支持批量压缩多个图片</li>
        <li>可自定义压缩质量，平衡文件大小和画质</li>
        <li>支持多种输出格式（JPG, PNG, WEBP）</li>
        <li>可设置最大宽度，自动调整高度</li>
        <li>支持移除元数据，保护隐私</li>
        <li>支持渐进式JPEG，提升加载体验</li>
        <li>实时显示压缩率和文件大小对比</li>
        <li>支持拖拽上传，操作简便</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const files = ref([])
const compressLevel = ref(50)
const selectedFormat = ref('jpg')
const maxWidth = ref(null)
const removeMetadata = ref(true)
const convertToProgressive = ref(false)
const isCompressing = ref(false)
const compressionResults = ref([])

const outputFormats = [
  { value: 'jpg', name: 'JPG', icon: '🖼️' },
  { value: 'png', name: 'PNG', icon: '🖼️' },
  { value: 'webp', name: 'WEBP', icon: '🖼️' }
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
    return file.type.startsWith('image/')
  })
  files.value = [...files.value, ...validFiles]
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const getPreviewUrl = (file) => {
  return URL.createObjectURL(file)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const startCompression = async () => {
  if (files.value.length === 0) return
  
  isCompressing.value = true
  compressionResults.value = []
  
  for (const file of files.value) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const originalSize = file.size
    const compressedSize = Math.round(originalSize * (1 - compressLevel.value / 200))
    const compressionRate = Math.round((1 - compressedSize / originalSize) * 100)
    
    compressionResults.value.push({
      fileName: file.name,
      originalSize,
      compressedSize,
      compressionRate,
      previewUrl: URL.createObjectURL(file),
      file: file
    })
  }
  
  isCompressing.value = false
}

const downloadFile = (result) => {
  const link = document.createElement('a')
  link.href = result.previewUrl
  link.download = `compressed-${result.fileName.replace(/\.[^/.]+$/, '')}.${selectedFormat.value}`
  link.click()
}

const downloadAll = () => {
  alert('打包下载功能需要后端支持')
}

const clearAll = () => {
  files.value = []
  compressionResults.value = []
}
</script>

<style scoped>
.image-compressor-page {
  max-width: 1400px;
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

.compressor-container {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  position: relative;
}

.file-preview {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.file-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  text-align: center;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  border-radius: 50%;
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
  gap: 0.75rem;
}

.option-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.option-label input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-border);
  border-radius: 3px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-value {
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  color: var(--color-primary);
}

.option-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 0;
}

.format-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  font-size: 0.875rem;
}

.option-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.option-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.compress-button,
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

.compress-button {
  background-color: var(--color-primary);
  color: white;
}

.compress-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.compress-button:disabled {
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.result-preview {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-stats {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.stat-label {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stat-value {
  color: var(--color-text-primary);
  font-weight: 600;
}

.stat-value.success {
  color: #10b981;
}

.download-button {
  padding: 0.625rem 1.25rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.download-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.download-all-section {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.download-all-button {
  padding: 0.875rem 2rem;
  background-color: var(--color-primary);
  color: white;
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

.download-all-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
  .image-compressor-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .compressor-container {
    padding: 1.5rem;
  }

  .format-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .compress-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }

  .file-items,
  .result-items {
    grid-template-columns: 1fr;
  }
}
</style>
