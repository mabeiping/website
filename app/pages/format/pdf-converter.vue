<template>
  <div class="pdf-converter-page">
    <h1 class="page-title">PDF转换工具</h1>
    
    <div class="pdf-converter-container">
      <!-- 转换类型选择 -->
      <div class="conversion-type">
        <h2>选择转换类型</h2>
        
        <div class="type-buttons">
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'pdf-to-word' }" 
            @click="conversionType = 'pdf-to-word'"
          >
            PDF → Word
          </button>
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'word-to-pdf' }" 
            @click="conversionType = 'word-to-pdf'"
          >
            Word → PDF
          </button>
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'pdf-to-excel' }" 
            @click="conversionType = 'pdf-to-excel'"
          >
            PDF → Excel
          </button>
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'excel-to-pdf' }" 
            @click="conversionType = 'excel-to-pdf'"
          >
            Excel → PDF
          </button>
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'pdf-to-image' }" 
            @click="conversionType = 'pdf-to-image'"
          >
            PDF → 图片
          </button>
          <button 
            class="type-btn" 
            :class="{ active: conversionType === 'image-to-pdf' }" 
            @click="conversionType = 'image-to-pdf'"
          >
            图片 → PDF
          </button>
        </div>
      </div>
      
      <!-- 转换界面 -->
      <div class="conversion-interface">
        <!-- 上传区域 -->
        <div class="upload-section">
          <h2>上传文件</h2>
          
          <div 
            class="upload-area" 
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            @drop.prevent="handleDrop"
            @click="fileInputRef.click()"
          >
            <input 
              ref="fileInputRef"
              type="file" 
              :accept="acceptedFileTypes"
              @change="handleFileSelect"
              style="display: none"
              :multiple="conversionType === 'image-to-pdf'"
            >
            
            <div class="upload-content" :class="{ 'drag-over': dragOver }">
              <div class="upload-icon">📁</div>
              <p class="upload-text">点击或拖拽文件到此处上传</p>
              <p class="upload-hint">{{ getFileHint() }}</p>
            </div>
          </div>
          
          <!-- 已上传文件列表 -->
          <div class="file-list" v-if="selectedFiles.length > 0">
            <h3>已上传文件</h3>
            <div 
              v-for="(file, index) in selectedFiles" 
              :key="index"
              class="file-item"
            >
              <div class="file-info">
                <div class="file-icon">{{ getFileIcon(file.name) }}</div>
                <div class="file-details">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-size">{{ formatFileSize(file.size) }}</div>
                </div>
              </div>
              <button class="remove-file-btn" @click="removeFile(index)">×</button>
            </div>
          </div>
          
          <!-- 转换设置 -->
          <div class="conversion-settings" v-if="selectedFiles.length > 0">
            <h3>转换设置</h3>
            
            <!-- PDF转图片特有设置 -->
            <div v-if="conversionType === 'pdf-to-image'" class="setting-item">
              <label for="imageFormat">图片格式：</label>
              <select id="imageFormat" v-model="imageFormat">
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            
            <!-- PDF特有设置 -->
            <div v-if="conversionType.endsWith('-to-pdf')" class="setting-item">
              <label for="pdfQuality">PDF质量：</label>
              <select id="pdfQuality" v-model="pdfQuality">
                <option value="low">低</option>
                <option value="medium" selected>中</option>
                <option value="high">高</option>
              </select>
            </div>
          </div>
          
          <!-- 转换按钮 -->
          <div class="action-buttons" v-if="selectedFiles.length > 0">
            <button class="convert-btn" @click="startConversion" :disabled="isConverting">
              {{ isConverting ? '转换中...' : '开始转换' }}
            </button>
            <button class="clear-btn" @click="clearFiles">清空</button>
          </div>
        </div>
        
        <!-- 转换结果 -->
        <div class="result-section" v-if="conversionResults.length > 0">
          <h2>转换结果</h2>
          
          <div class="result-list">
            <div 
              v-for="(result, index) in conversionResults" 
              :key="index"
              class="result-item"
            >
              <div class="result-info">
                <div class="result-icon">📄</div>
                <div class="result-details">
                  <div class="result-name">{{ result.name }}</div>
                  <div class="result-size">{{ formatFileSize(result.size) }}</div>
                </div>
              </div>
              <div class="result-actions">
                <button class="download-btn" @click="downloadResult(result)">下载</button>
                <button class="preview-btn" @click="previewResult(result)">预览</button>
              </div>
            </div>
          </div>
          
          <button class="download-all-btn" @click="downloadAllResults">下载全部</button>
        </div>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="pdf-converter-info">
      <h2>功能说明</h2>
      <p>PDF转换工具支持多种文件格式之间的相互转换，包括PDF、Word、Excel和图片。</p>
      <ul>
        <li>支持PDF与Word文档的相互转换</li>
        <li>支持PDF与Excel表格的相互转换</li>
        <li>支持PDF与图片的相互转换</li>
        <li>支持批量上传和转换</li>
        <li>可自定义转换质量和图片格式</li>
        <li>转换后的文件可直接下载或预览</li>
        <li>支持拖拽上传和点击上传两种方式</li>
        <li>自动保存转换历史，方便查看和下载</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 转换类型
const conversionType = ref('pdf-to-word')

// 拖拽状态
const dragOver = ref(false)

// 文件输入引用
const fileInputRef = ref(null)

// 已选择文件
const selectedFiles = ref([])

// 转换设置
const imageFormat = ref('png')
const pdfQuality = ref('medium')

// 转换状态
const isConverting = ref(false)

// 转换结果
const conversionResults = ref([])

// 支持的文件类型
const acceptedFileTypes = computed(() => {
  switch (conversionType.value) {
    case 'pdf-to-word':
    case 'pdf-to-excel':
    case 'pdf-to-image':
      return '.pdf'
    case 'word-to-pdf':
      return '.doc,.docx'
    case 'excel-to-pdf':
      return '.xls,.xlsx'
    case 'image-to-pdf':
      return '.jpg,.jpeg,.png,.gif,.webp'
    default:
      return ''
  }
})

// 获取文件提示
const getFileHint = () => {
  switch (conversionType.value) {
    case 'pdf-to-word':
    case 'pdf-to-excel':
    case 'pdf-to-image':
      return '支持PDF文件，最大50MB'
    case 'word-to-pdf':
      return '支持DOC、DOCX文件，最大50MB'
    case 'excel-to-pdf':
      return '支持XLS、XLSX文件，最大50MB'
    case 'image-to-pdf':
      return '支持JPG、PNG、GIF、WebP文件，最大50MB，支持多文件上传'
    default:
      return ''
  }
}

// 获取文件图标
const getFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase()
  switch (ext) {
    case 'pdf': return '📄'
    case 'doc':
    case 'docx': return '📝'
    case 'xls':
    case 'xlsx': return '📊'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp': return '🖼️'
    default: return '📁'
  }
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  return `${(size / (1024 * 1024)).toFixed(2)} MB`
}

// 处理文件选择
const handleFileSelect = (event) => {
  const files = event.target.files
  if (files.length === 0) return
  
  // 添加选择的文件到列表
  for (let i = 0; i < files.length; i++) {
    selectedFiles.value.push(files[i])
  }
  
  // 清空文件输入，以便再次选择相同文件
  event.target.value = ''
}

// 处理拖拽上传
const handleDrop = (event) => {
  dragOver.value = false
  const files = event.dataTransfer.files
  if (files.length === 0) return
  
  // 添加拖拽的文件到列表
  for (let i = 0; i < files.length; i++) {
    selectedFiles.value.push(files[i])
  }
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 清空文件
const clearFiles = () => {
  selectedFiles.value = []
}

// 开始转换
const startConversion = () => {
  if (selectedFiles.value.length === 0) return
  
  isConverting.value = true
  
  // 模拟转换过程
  setTimeout(() => {
    // 清空之前的结果
    conversionResults.value = []
    
    // 生成模拟转换结果
    selectedFiles.value.forEach(file => {
      const result = {
        name: generateResultName(file.name),
        size: Math.floor(file.size * 0.8), // 模拟转换后文件大小
        url: URL.createObjectURL(new Blob(['模拟转换结果'], { type: 'application/octet-stream' }))
      }
      conversionResults.value.push(result)
    })
    
    isConverting.value = false
  }, 2000)
}

// 生成结果文件名
const generateResultName = (originalName) => {
  const nameWithoutExt = originalName.split('.').slice(0, -1).join('.')
  const timestamp = Date.now()
  
  let ext = ''
  switch (conversionType.value) {
    case 'pdf-to-word': ext = '.docx'
      break
    case 'word-to-pdf': ext = '.pdf'
      break
    case 'pdf-to-excel': ext = '.xlsx'
      break
    case 'excel-to-pdf': ext = '.pdf'
      break
    case 'pdf-to-image': ext = `.${imageFormat.value}`
      break
    case 'image-to-pdf': ext = '.pdf'
      break
    default: ext = '.pdf'
  }
  
  return `${nameWithoutExt}_converted_${timestamp}${ext}`
}

// 下载结果
const downloadResult = (result) => {
  const link = document.createElement('a')
  link.href = result.url
  link.download = result.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 预览结果
const previewResult = (result) => {
  window.open(result.url, '_blank')
}

// 下载全部结果
const downloadAllResults = () => {
  conversionResults.value.forEach(result => {
    downloadResult(result)
  })
}
</script>

<style scoped>
.pdf-converter-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.pdf-converter-container {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.conversion-type {
  margin-bottom: 2rem;
}

.conversion-type h2 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.type-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.type-btn {
  flex: 1;
  min-width: 120px;
  padding: 1rem;
  border: 2px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.type-btn:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.type-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.conversion-interface {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-section {
  margin-bottom: 2rem;
}

.upload-section h2 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.upload-area {
  border: 2px dashed var(--color-border);
  border-radius: 8px;
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

.upload-area.drag-over {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.file-list {
  margin-top: 1.5rem;
}

.file-list h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  margin-bottom: 0.75rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 1.5rem;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.file-size {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.remove-file-btn {
  background: none;
  border: none;
  color: var(--color-danger);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  transform: scale(1.1);
}

.conversion-settings {
  margin-top: 1.5rem;
}

.conversion-settings h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.setting-item {
  margin-bottom: 1rem;
}

.setting-item label {
  display: block;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.setting-item select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.setting-item select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.convert-btn,
.clear-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.convert-btn {
  background-color: var(--color-primary);
  color: white;
}

.convert-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.convert-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.clear-btn:hover {
  background-color: var(--color-bg-quaternary);
}

.result-section {
  margin-top: 2rem;
}

.result-section h2 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.result-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.result-icon {
  font-size: 1.5rem;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.result-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.result-size {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.result-actions {
  display: flex;
  gap: 0.5rem;
}

.download-btn,
.preview-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover,
.preview-btn:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.download-all-btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  border: none;
  border-radius: 8px;
  background-color: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-all-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.pdf-converter-info {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.pdf-converter-info h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.pdf-converter-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.pdf-converter-info ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.pdf-converter-info ul li {
  margin-bottom: 0.5rem;
}
</style>
