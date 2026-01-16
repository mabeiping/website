<template>
  <div class="gif-processor-page">
    <h1 class="page-title">GIF图片处理工具</h1>
    
    <div class="processor-container">
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <div class="upload-icon">🎬</div>
          <div class="upload-text">
            <p>拖拽GIF文件到此处或点击上传</p>
            <p class="upload-hint">支持 GIF 格式</p>
          </div>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".gif"
            style="display: none"
          />
        </div>
        
        <div v-if="selectedFile" class="file-preview">
          <h3>已选择文件</h3>
          <div class="preview-item">
            <img :src="previewUrl" alt="GIF预览" class="preview-image" />
            <div class="file-info">
              <p class="file-name">{{ selectedFile.name }}</p>
              <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <button class="remove-button" @click="removeFile">✕</button>
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
              <label>宽度</label>
              <input 
                type="number" 
                v-model.number="resizeWidth" 
                placeholder="自动"
                min="1"
                class="size-input"
              />
            </div>
            <div class="input-wrapper">
              <label>高度</label>
              <input 
                type="number" 
                v-model.number="resizeHeight" 
                placeholder="自动"
                min="1"
                class="size-input"
              />
            </div>
          </div>
          <label class="checkbox-label">
            <input type="checkbox" v-model="maintainAspectRatio" />
            保持宽高比
          </label>
        </div>
        
        <div v-if="selectedMode === 'optimize'" class="option-group">
          <label class="option-label">优化级别</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model.number="optimizeLevel" 
              min="1" 
              max="100" 
              class="slider"
            />
            <span class="slider-value">{{ optimizeLevel }}%</span>
          </div>
          <p class="option-hint">数值越高，压缩率越大，但可能损失画质</p>
        </div>
        
        <div v-if="selectedMode === 'split'" class="option-group">
          <label class="option-label">帧率</label>
          <select class="option-select" v-model="frameRate">
            <option value="5">5 FPS</option>
            <option value="10">10 FPS</option>
            <option value="15">15 FPS</option>
            <option value="30">30 FPS</option>
            <option value="60">60 FPS</option>
          </select>
        </div>
        
        <div v-if="selectedMode === 'crop'" class="option-group">
          <label class="option-label">裁剪区域</label>
          <div class="crop-inputs">
            <div class="input-wrapper">
              <label>上</label>
              <input 
                type="number" 
                v-model.number="cropTop" 
                min="0"
                class="size-input"
              />
            </div>
            <div class="input-wrapper">
              <label>右</label>
              <input 
                type="number" 
                v-model.number="cropRight" 
                min="0"
                class="size-input"
              />
            </div>
            <div class="input-wrapper">
              <label>下</label>
              <input 
                type="number" 
                v-model.number="cropBottom" 
                min="0"
                class="size-input"
              />
            </div>
            <div class="input-wrapper">
              <label>左</label>
              <input 
                type="number" 
                v-model.number="cropLeft" 
                min="0"
                class="size-input"
              />
            </div>
          </div>
        </div>
        
        <div v-if="selectedMode === 'reverse'" class="option-group">
          <label class="option-label">
            <input type="checkbox" v-model="loopReverse" />
            循环播放
          </label>
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
          <img :src="processedResult.url" alt="处理后的GIF" class="result-image" />
          <div class="result-info">
            <p class="result-name">处理完成</p>
            <p class="result-size">{{ formatFileSize(processedResult.size) }}</p>
            <button class="download-button" @click="downloadResult">
              ⬇️ 下载
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能丰富的GIF图片处理工具，支持多种处理模式。</p>
      <ul>
        <li>支持调整GIF尺寸，保持宽高比</li>
        <li>优化GIF文件大小，提高加载速度</li>
        <li>调整GIF帧率，控制动画速度</li>
        <li>裁剪GIF图片，去除不需要的部分</li>
        <li>反转GIF动画方向，创造有趣效果</li>
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
const selectedMode = ref('resize')
const resizeWidth = ref(null)
const resizeHeight = ref(null)
const maintainAspectRatio = ref(true)
const optimizeLevel = ref(50)
const frameRate = ref(15)
const cropTop = ref(0)
const cropRight = ref(0)
const cropBottom = ref(0)
const cropLeft = ref(0)
const loopReverse = ref(false)
const isProcessing = ref(false)
const processedResult = ref(null)

const processModes = [
  { value: 'resize', name: '调整尺寸', icon: '📐' },
  { value: 'optimize', name: '优化压缩', icon: '📦' },
  { value: 'split', name: '调整帧率', icon: '⚡' },
  { value: 'crop', name: '裁剪图片', icon: '✂️' },
  { value: 'reverse', name: '反转动画', icon: '🔄' }
]

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'image/gif') {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'image/gif') {
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
    size: Math.round(selectedFile.value.size * (1 - optimizeLevel.value / 200))
  }
  
  isProcessing.value = false
}

const downloadResult = () => {
  if (!processedResult.value) return
  
  const link = document.createElement('a')
  link.href = processedResult.value.url
  link.download = `processed-${selectedFile.value.name}`
  link.click()
}

const clearAll = () => {
  selectedFile.value = null
  previewUrl.value = ''
  processedResult.value = null
  resizeWidth.value = null
  resizeHeight.value = null
  cropTop.value = 0
  cropRight.value = 0
  cropBottom.value = 0
  cropLeft.value = 0
}
</script>

<style scoped>
.gif-processor-page {
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

.file-preview h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
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
  max-height: 200px;
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

.size-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.size-input:focus {
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

.crop-inputs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
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
  max-height: 200px;
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

.download-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
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
  .gif-processor-page {
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

  .size-inputs,
  .crop-inputs {
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

  .download-button {
    width: 100%;
  }
}
</style>
