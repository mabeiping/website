<template>
  <div class="pdf-toolbox-page">
    <h1 class="page-title">PDF工具箱</h1>
    
    <div class="toolbox-container">
      <div class="tools-grid">
        <div 
          v-for="tool in tools" 
          :key="tool.id"
          class="tool-card"
          @click="selectTool(tool)"
          :class="{ active: selectedTool === tool.id }"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <div class="tool-name">{{ tool.name }}</div>
          <div class="tool-description">{{ tool.description }}</div>
        </div>
      </div>
      
      <div v-if="selectedTool" class="tool-workspace">
        <div class="upload-section">
          <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
            <div class="upload-icon">📄</div>
            <div class="upload-text">
              <p>拖拽PDF文件到此处或点击上传</p>
              <p class="upload-hint">支持 PDF 格式</p>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept=".pdf"
              multiple
              style="display: none"
            />
          </div>
          
          <div v-if="files.length > 0" class="file-list">
            <h3>已选择文件 ({{ files.length }})</h3>
            <div class="file-items">
              <div v-for="(file, index) in files" :key="index" class="file-item">
                <span class="file-icon">📕</span>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-button" @click="removeFile(index)">✕</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="options-section">
          <h3>{{ getToolName() }}选项</h3>
          
          <div v-if="selectedTool === 'merge'" class="option-group">
            <label class="option-label">合并顺序</label>
            <div class="order-options">
              <label class="radio-option">
                <input type="radio" v-model="mergeOrder" value="asc" name="mergeOrder" />
                <span>按文件名升序</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="mergeOrder" value="desc" name="mergeOrder" />
                <span>按文件名降序</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="mergeOrder" value="custom" name="mergeOrder" />
                <span>自定义顺序</span>
              </label>
            </div>
          </div>
          
          <div v-if="selectedTool === 'split'" class="option-group">
            <label class="option-label">分割方式</label>
            <select class="option-select" v-model="splitMode">
              <option value="pages">按页数分割</option>
              <option value="range">按页码范围</option>
              <option value="bookmark">按书签分割</option>
            </select>
          </div>
          
          <div v-if="selectedTool === 'split' && splitMode === 'pages'" class="option-group">
            <label class="option-label">每页数</label>
            <input 
              type="number" 
              v-model.number="pagesPerSplit" 
              min="1"
              class="option-input"
            />
          </div>
          
          <div v-if="selectedTool === 'split' && splitMode === 'range'" class="option-group">
            <label class="option-label">页码范围</label>
            <div class="range-inputs">
              <input 
                type="number" 
                v-model.number="rangeStart" 
                min="1"
                placeholder="起始页"
                class="option-input"
              />
              <input 
                type="number" 
                v-model.number="rangeEnd" 
                min="1"
                placeholder="结束页"
                class="option-input"
              />
            </div>
          </div>
          
          <div v-if="selectedTool === 'compress'" class="option-group">
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
          
          <div v-if="selectedTool === 'convert'" class="option-group">
            <label class="option-label">目标格式</label>
            <div class="format-options">
              <label 
                v-for="format in convertFormats" 
                :key="format.value"
                class="format-option"
                :class="{ active: selectedConvertFormat === format.value }"
              >
                <input 
                  type="radio" 
                  v-model="selectedConvertFormat" 
                  :value="format.value"
                  name="convertFormat"
                />
                <span class="format-icon">{{ format.icon }}</span>
                <span class="format-name">{{ format.name }}</span>
              </label>
            </div>
          </div>
          
          <div v-if="selectedTool === 'extract'" class="option-group">
            <label class="option-label">提取内容</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="extractText" />
                提取文本
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="extractImages" />
                提取图片
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="extractTables" />
                提取表格
              </label>
            </div>
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
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能丰富的PDF工具箱，提供多种PDF处理功能。</p>
      <ul>
        <li>PDF合并：将多个PDF文件合并为一个文件</li>
        <li>PDF分割：将PDF文件按页数、页码范围或书签分割</li>
        <li>PDF压缩：减小PDF文件大小，提高传输速度</li>
        <li>PDF转换：将PDF转换为图片、Word等格式</li>
        <li>PDF提取：从PDF中提取文本、图片、表格等内容</li>
        <li>批量处理，支持拖拽上传</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const files = ref([])
const selectedTool = ref(null)
const mergeOrder = ref('asc')
const splitMode = ref('pages')
const pagesPerSplit = ref(1)
const rangeStart = ref(null)
const rangeEnd = ref(null)
const compressLevel = ref(50)
const selectedConvertFormat = ref('jpg')
const extractText = ref(true)
const extractImages = ref(true)
const extractTables = ref(false)
const isProcessing = ref(false)
const processingResults = ref([])

const tools = [
  { id: 'merge', name: 'PDF合并', icon: '🔗', description: '将多个PDF合并为一个文件' },
  { id: 'split', name: 'PDF分割', icon: '✂️', description: '将PDF按页数或范围分割' },
  { id: 'compress', name: 'PDF压缩', icon: '📦', description: '减小PDF文件大小' },
  { id: 'convert', name: 'PDF转换', icon: '🔄', description: '转换为其他格式' },
  { id: 'extract', name: 'PDF提取', icon: '📤', description: '提取文本、图片、表格' }
]

const convertFormats = [
  { value: 'jpg', name: 'JPG', icon: '🖼️' },
  { value: 'png', name: 'PNG', icon: '🖼️' },
  { value: 'docx', name: 'DOCX', icon: '📘' },
  { value: 'txt', name: 'TXT', icon: '📝' }
]

const selectTool = (tool) => {
  selectedTool.value = tool.id
  clearAll()
}

const getToolName = () => {
  const tool = tools.find(t => t.id === selectedTool.value)
  return tool ? tool.name : ''
}

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
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
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

const startProcessing = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  processingResults.value = []
  
  for (const file of files.value) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = Math.random() > 0.2
    processingResults.value.push({
      fileName: file.name,
      success,
      message: success 
        ? `${getToolName()}成功` 
        : '处理失败，请重试',
      file: success ? file : null
    })
  }
  
  isProcessing.value = false
}

const downloadFile = (result) => {
  const link = document.createElement('a')
  link.href = '#'
  link.download = `processed-${result.fileName}`
  link.click()
}

const clearAll = () => {
  files.value = []
  processingResults.value = []
}
</script>

<style scoped>
.pdf-toolbox-page {
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

.toolbox-container {
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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 10px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.tool-card.active {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.tool-icon {
  font-size: 3rem;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
}

.tool-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.4;
}

.tool-workspace {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
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
  gap: 0.75rem;
}

.option-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.order-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.radio-option input {
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

.range-inputs {
  display: flex;
  gap: 1rem;
}

.range-inputs .option-input {
  flex: 1;
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
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  .pdf-toolbox-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .toolbox-container {
    padding: 1.5rem;
  }

  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .process-button,
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
