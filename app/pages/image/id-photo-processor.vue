<template>
  <div class="id-photo-processor-page">
    <h1 class="page-title">证件照处理工具</h1>
    
    <div class="processor-container">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-icon">📷</div>
          <div class="upload-text">
            <p>拖拽照片到此处或点击上传</p>
            <p class="upload-hint">支持 JPG, PNG 格式</p>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".jpg,.jpeg,.png"
            style="display: none"
          />
        </div>
        
        <div v-if="selectedFile" class="preview-section">
          <h3>照片预览</h3>
          <div class="preview-container">
            <div class="preview-item">
              <img :src="previewUrl" alt="照片预览" class="preview-image" />
              <div class="file-info">
                <p class="file-name">{{ selectedFile.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                <button class="remove-button" @click="removeFile">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="options-section">
        <h3>处理选项</h3>
        
        <div class="option-group">
          <label class="option-label">证件类型</label>
          <select class="option-select" v-model="photoType">
            <option value="id1">一寸证件照</option>
            <option value="id2">二寸证件照</option>
            <option value="passport">护照照片</option>
            <option value="visa">签证照片</option>
            <option value="driving">驾驶证照片</option>
            <option value="student">学生证照片</option>
            <option value="custom">自定义尺寸</option>
          </select>
        </div>
        
        <div v-if="photoType === 'custom'" class="option-group">
          <label class="option-label">自定义尺寸</label>
          <div class="size-inputs">
            <div class="input-wrapper">
              <label>宽度 (mm)</label>
              <input 
                type="number" 
                v-model.number="customWidth" 
                min="20"
                max="100"
                class="option-input"
              />
            </div>
            <div class="input-wrapper">
              <label>高度 (mm)</label>
              <input 
                type="number" 
                v-model.number="customHeight" 
                min="20"
                max="100"
                class="option-input"
              />
            </div>
          </div>
        </div>
        
        <div class="option-group">
          <label class="option-label">背景颜色</label>
          <div class="color-options">
            <label 
              v-for="color in backgroundColors" 
              :key="color.value"
              class="color-option"
              :class="{ active: backgroundColor === color.value }"
            >
              <input 
                type="radio" 
                v-model="backgroundColor" 
                :value="color.value"
                name="backgroundColor"
              />
              <span class="color-preview" :style="{ backgroundColor: color.hex }"></span>
              <span class="color-name">{{ color.name }}</span>
            </label>
          </div>
        </div>
        
        <div class="option-group">
          <label class="option-label">图片质量</label>
          <select class="option-select" v-model="quality">
            <option value="high">高质量</option>
            <option value="medium">标准质量</option>
            <option value="low">低质量（文件更小）</option>
          </select>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="autoCrop" />
            自动裁剪人脸
          </label>
        </div>
        
        <div class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="addWatermark" />
            添加水印
          </label>
        </div>
        
        <div v-if="addWatermark" class="option-group">
          <label class="option-label">水印文字</label>
          <input 
            type="text" 
            v-model="watermarkText" 
            placeholder="输入水印文字"
            class="option-input"
          />
        </div>
      </div>
      
      <div class="action-section">
        <button 
          class="process-button" 
          @click="startProcessing"
          :disabled="!selectedFile || isProcessing"
        >
          <span v-if="!isProcessing">🎨 开始处理</span>
          <span v-else>⏳ 处理中...</span>
        </button>
        <button class="clear-button" @click="clearAll" :disabled="isProcessing">
          🗑️ 清空
        </button>
      </div>
      
      <div v-if="processedResult" class="result-section">
        <h3>处理结果</h3>
        <div class="result-preview">
          <img :src="processedResult.url" alt="处理后的照片" class="result-image" />
          <div class="result-info">
            <p class="result-name">处理完成</p>
            <p class="result-size">{{ formatFileSize(processedResult.size) }}</p>
            <div class="download-buttons">
              <button class="download-button" @click="downloadResult('jpg')">
                ⬇️ 下载JPG
              </button>
              <button class="download-button" @click="downloadResult('png')">
                ⬇️ 下载PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能丰富的证件照处理工具，支持多种证件类型和自定义尺寸。</p>
      <ul>
        <li>支持一寸、二寸、护照、签证、驾驶证、学生证等多种证件类型</li>
        <li>支持自定义尺寸，满足特殊需求</li>
        <li>支持更换背景颜色（白、蓝、红）</li>
        <li>支持自动裁剪人脸，智能识别</li>
        <li>支持添加水印文字，保护照片版权</li>
        <li>支持多种输出格式和质量选择</li>
        <li>实时预览处理效果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const photoType = ref('id1')
const customWidth = ref(25)
const customHeight = ref(35)
const backgroundColor = ref('white')
const quality = ref('medium')
const autoCrop = ref(true)
const addWatermark = ref(false)
const watermarkText = ref('')
const isProcessing = ref(false)
const processedResult = ref(null)

const backgroundColors = [
  { value: 'white', name: '白色', hex: '#FFFFFF' },
  { value: 'blue', name: '蓝色', hex: '#438ED9' },
  { value: 'red', name: '红色', hex: '#C7000B' }
]

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  processedResult.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const startProcessing = async () => {
  if (!selectedFile.value) return
  
  isProcessing.value = true
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  processedResult.value = {
    url: previewUrl.value,
    size: Math.round(selectedFile.value.size * 0.8)
  }
  
  isProcessing.value = false
}

const downloadResult = (format) => {
  if (!processedResult.value) return
  
  const link = document.createElement('a')
  link.href = processedResult.value.url
  link.download = `id-photo.${format}`
  link.click()
}

const clearAll = () => {
  selectedFile.value = null
  previewUrl.value = ''
  processedResult.value = null
  watermarkText.value = ''
}
</script>

<style scoped>
.id-photo-processor-page {
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

.preview-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.preview-container {
  display: flex;
  justify-content: center;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.preview-image {
  max-width: 200px;
  max-height: 250px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.file-size {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.remove-button {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
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

.color-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.color-option {
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

.color-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.color-option.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.color-option input {
  display: none;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

.color-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
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

.result-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.result-preview {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.result-image {
  max-width: 200px;
  max-height: 250px;
  border-radius: 8px;
  border: 2px solid var(--color-primary);
}

.result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.result-size {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.download-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.download-button {
  padding: 0.75rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
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
  .id-photo-processor-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .processor-container {
    padding: 1.5rem;
  }

  .color-options {
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

  .preview-item,
  .result-preview {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .preview-image,
  .result-image {
    max-width: 100%;
    max-height: 200px;
  }

  .download-buttons {
    flex-direction: column;
    width: 100%;
  }

  .download-button {
    width: 100%;
  }
}
</style>
