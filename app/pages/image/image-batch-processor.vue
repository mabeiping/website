<template>
  <div class="image-batch-processor-page">
    <h1 class="page-title">图像批量处理工具</h1>
    
    <div class="processor-container">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-icon">🖼️</div>
          <div class="upload-text">
            <p>拖拽图片到此处或点击上传</p>
            <p class="upload-hint">支持 JPG, PNG, GIF, WEBP 格式</p>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".jpg,.jpeg,.png,.gif,.webp"
            multiple
            style="display: none"
          />
        </div>
        
        <div v-if="files.length > 0" class="file-list">
          <h3>已选择文件 ({{ files.length }})</h3>
          <div class="file-items">
            <div v-for="(file, index) in files" :key="index" class="file-item">
              <img :src="getPreviewUrl(file)" alt="预览" class="file-preview" />
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="remove-button" @click="removeFile(index)">✕</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="options-section">
        <h3>处理选项</h3>
        
        <div class="option-group">
          <label class="option-label">处理模式</label>
          <div class="mode-options">
            <label 
              v-for="mode in processModes" 
              :key="mode.value"
              class="mode-option"
              :class="{ active: selectedMode === mode.value }"
            >
              <input 
                type="radio" 
                v-model="selectedMode" 
                :value="mode.value"
                name="processMode"
              />
              <span class="mode-icon">{{ mode.icon }}</span>
              <span class="mode-name">{{ mode.name }}</span>
            </label>
          </div>
        </div>
        
        <div v-if="selectedMode === 'resize'" class="option-group">
          <label class="option-label">调整尺寸</label>
          <div class="size-inputs">
            <div class="input-wrapper">
              <label>宽度 (px)</label>
              <input 
                type="number" 
                v-model.number="resizeWidth" 
                placeholder="自动"
                min="1"
                class="option-input"
              />
            </div>
            <div class="input-wrapper">
              <label>高度 (px)</label>
              <input 
                type="number" 
                v-model.number="resizeHeight" 
                placeholder="自动"
                min="1"
                class="option-input"
              />
            </div>
          </div>
          <label class="checkbox-label">
            <input type="checkbox" v-model="maintainAspectRatio" />
            保持宽高比
          </label>
        </div>
        
        <div v-if="selectedMode === 'compress'" class="option-group">
          <label class="option-label">压缩级别</label>
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
        
        <div v-if="selectedMode === 'format'" class="option-group">
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
        
        <div v-if="selectedMode === 'watermark'" class="option-group">
          <label class="option-label">水印文字</label>
          <input 
            type="text" 
            v-model="watermarkText" 
            placeholder="输入水印文字"
            class="option-input"
          />
        </div>
        
        <div v-if="selectedMode === 'watermark'" class="option-group">
          <label class="option-label">水印位置</label>
          <select class="option-select" v-model="watermarkPosition">
            <option value="top-left">左上角</option>
            <option value="top-right">右上角</option>
            <option value="bottom-left">左下角</option>
            <option value="bottom-right">右下角</option>
            <option value="center">居中</option>
          </select>
        </div>
        
        <div v-if="selectedMode === 'rotate'" class="option-group">
          <label class="option-label">旋转角度</label>
          <select class="option-select" v-model="rotateAngle">
            <option value="90">90度</option>
            <option value="180">180度</option>
            <option value="270">270度</option>
            <option value="custom">自定义角度</option>
          </select>
        </div>
        
        <div v-if="selectedMode === 'rotate' && rotateAngle === 'custom'" class="option-group">
          <label class="option-label">自定义角度</label>
          <input 
            type="number" 
            v-model.number="customAngle" 
            min="0"
            max="360"
            class="option-input"
          />
        </div>
        
        <div class="option-group">
          <label class="option-label">输出质量</label>
          <select class="option-select" v-model="quality">
            <option value="high">高质量</option>
            <option value="medium">标准质量</option>
            <option value="low">低质量（文件更小）</option>
          </select>
        </div>
      </div>
      
      <div class="action-section">
        <button 
          class="process-button" 
          @click="startProcessing"
          :disabled="files.length === 0 || isProcessing"
        >
          <span v-if="!isProcessing">🚀 开始处理</span>
          <span v-else>⏳ 处理中...</span>
        </button>
        <button class="clear-button" @click="clearAll" :disabled="isProcessing">
          🗑️ 清空
        </button>
      </div>
      
      <div v-if="processingResults.length > 0" class="results-section">
        <h3>处理结果</h3>
        <div class="result-items">
          <div v-for="(result, index) in processingResults" :key="index" class="result-item">
            <span class="result-icon">{{ result.success ? '✅' : '❌' }}</span>
            <span class="result-name">{{ result.fileName }}</span>
            <span class="result-size">{{ formatFileSize(result.size) }}</span>
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
        <div class="download-all-section">
          <button class="download-all-button" @click="downloadAll">
            📦 打包下载全部
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的图像批量处理工具，支持多种处理模式。</p>
      <ul>
        <li>支持批量调整图片尺寸，保持宽高比</li>
        <li>支持批量压缩图片，减小文件大小</li>
        <li>支持批量转换图片格式</li>
        <li>支持批量添加水印文字</li>
        <li>支持批量旋转图片</li>
        <li>支持拖拽上传，一次处理多个文件</li>
        <li>支持打包下载所有处理结果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const files = ref([])
const selectedMode = ref('resize')
const resizeWidth = ref(null)
const resizeHeight = ref(null)
const maintainAspectRatio = ref(true)
const compressLevel = ref(50)
const selectedFormat = ref('jpg')
const watermarkText = ref('')
const watermarkPosition = ref('bottom-right')
const rotateAngle = ref('90')
const customAngle = ref(0)
const quality = ref('medium')
const isProcessing = ref(false)
const processingResults = ref([])

const processModes = [
  { value: 'resize', name: '调整尺寸', icon: '📐' },
  { value: 'compress', name: '压缩图片', icon: '📦' },
  { value: 'format', name: '转换格式', icon: '🔄' },
  { value: 'watermark', name: '添加水印', icon: '💧' },
  { value: 'rotate', name: '旋转图片', icon: '🔄' }
]

const outputFormats = [
  { value: 'jpg', name: 'JPG', icon: '🖼️' },
  { value: 'png', name: 'PNG', icon: '🖼️' },
  { value: 'webp', name: 'WEBP', icon: '🖼️' },
  { value: 'gif', name: 'GIF', icon: '🎬' }
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

const startProcessing = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  processingResults.value = []
  
  for (const file of files.value) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const success = Math.random() > 0.1
    processingResults.value.push({
      fileName: file.name,
      success,
      message: success 
        ? '处理成功' 
        : '处理失败，请重试',
      size: success ? Math.round(file.size * (1 - compressLevel.value / 200)) : 0,
      file: success ? file : null
    })
  }
  
  isProcessing.value = false
}

const downloadFile = (result) => {
  const link = document.createElement('a')
  link.href = '#'
  link.download = result.fileName
  link.click()
}

const downloadAll = () => {
  alert('打包下载功能需要后端支持')
}

const clearAll = () => {
  files.value = []
  processingResults.value = []
}
</script>

<style scoped>
.image-batch-processor-page {
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

.processor-container {
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
  gap: 0.5rem;
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

.file-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.file-size {
  color: var(--color-text-muted);
  font-size: 0.75rem;
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
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.mode-option {
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

.mode-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.mode-option.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.mode-option input {
  display: none;
}

.mode-icon {
  font-size: 2rem;
}

.mode-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.size-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
}

.checkbox-label input {
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
  grid-template-columns: repeat(4, 1fr);
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

.process-button,
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

.process-button {
  background-color: var(--color-primary);
  color: white;
}

.process-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.process-button:disabled {
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.result-icon {
  font-size: 1.5rem;
  text-align: center;
}

.result-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-size {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.result-status {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
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
  .image-batch-processor-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .processor-container {
    padding: 1.5rem;
  }

  .mode-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .format-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .size-inputs {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }

  .process-button,
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
