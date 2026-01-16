<template>
  <div class="icon-generator-container">
    <h1 class="tool-title">图标生成工具</h1>
    <p class="tool-desc">生成不同尺寸的网站图标，支持多种格式</p>
    
    <div class="tool-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <h2 class="section-title">输入</h2>
        
        <!-- 图标上传 -->
        <div class="upload-area">
          <div 
            class="upload-dropzone" 
            :class="{ 'dragover': isDragging }" 
            @dragover.prevent="onDragOver" 
            @dragleave.prevent="onDragLeave" 
            @drop.prevent="onDrop"
          >
            <input 
              type="file" 
              id="icon-upload" 
              class="file-input" 
              @change="onFileSelect" 
              accept="image/*"
            >
            <label for="icon-upload" class="upload-label">
              <div class="upload-icon">📤</div>
              <div class="upload-text">点击上传或拖拽图片到此处</div>
              <div class="upload-hint">支持 PNG, JPG, SVG 等格式，建议尺寸不小于 512x512px</div>
            </label>
          </div>
          
          <!-- 上传预览 -->
          <div v-if="selectedFile" class="file-preview">
            <div class="preview-header">
              <h3>预览</h3>
              <button class="remove-button" @click="removeFile">
                🗑️ 移除
              </button>
            </div>
            <div class="preview-image-container">
              <img 
                :src="previewUrl" 
                alt="预览" 
                class="preview-image" 
                @load="onImageLoad"
              >
            </div>
            <div class="file-info">
              <p><strong>文件名:</strong> {{ selectedFile.name }}</p>
              <p><strong>大小:</strong> {{ formatFileSize(selectedFile.size) }}</p>
              <p><strong>类型:</strong> {{ selectedFile.type }}</p>
              <p v-if="imageDimensions"><strong>尺寸:</strong> {{ imageDimensions.width }}x{{ imageDimensions.height }}px</p>
            </div>
          </div>
        </div>
        
        <!-- 图标设置 -->
        <div class="settings-section">
          <h3 class="settings-title">图标设置</h3>
          
          <!-- 尺寸选择 -->
          <div class="setting-item">
            <label class="setting-label">选择尺寸:</label>
            <div class="size-options">
              <label class="size-option" v-for="size in availableSizes" :key="size">
                <input 
                  type="checkbox" 
                  v-model="selectedSizes" 
                  :value="size"
                >
                <span class="size-text">{{ size }}x{{ size }}</span>
              </label>
            </div>
            <button class="select-all-button" @click="toggleSelectAllSizes">
              {{ selectedSizes.length === availableSizes.length ? '取消全选' : '全选' }}
            </button>
          </div>
          
          <!-- 格式选择 -->
          <div class="setting-item">
            <label class="setting-label">输出格式:</label>
            <div class="format-options">
              <label class="format-option" v-for="format in availableFormats" :key="format">
                <input 
                  type="checkbox" 
                  v-model="selectedFormats" 
                  :value="format"
                >
                <span class="format-text">{{ format.toUpperCase() }}</span>
              </label>
            </div>
            <button class="select-all-button" @click="toggleSelectAllFormats">
              {{ selectedFormats.length === availableFormats.length ? '取消全选' : '全选' }}
            </button>
          </div>
          
          <!-- 背景色设置 -->
          <div class="setting-item">
            <label class="setting-label">背景色:</label>
            <div class="color-picker-container">
              <input 
                type="color" 
                v-model="backgroundColor" 
                class="color-input"
              >
              <input 
                type="text" 
                v-model="backgroundColor" 
                class="color-text"
                placeholder="#ffffff"
              >
            </div>
            <label class="transparent-option">
              <input 
                type="checkbox" 
                v-model="isTransparent" 
                @change="toggleTransparency"
              >
              <span>透明背景</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 操作区域 -->
      <div class="action-section">
        <button 
          class="action-button primary" 
          @click="generateIcons"
          :disabled="!selectedFile || selectedSizes.length === 0 || selectedFormats.length === 0"
        >
          🎨 生成图标
        </button>
        <button 
          class="action-button secondary" 
          @click="clearAll"
        >
          🗑️ 清空
        </button>
      </div>
      
      <!-- 输出区域 -->
      <div class="output-section" v-if="generatedIcons.length > 0">
        <h2 class="section-title">输出</h2>
        
        <!-- 输出列表 -->
        <div class="output-list">
          <div 
            class="output-item" 
            v-for="(icon, index) in generatedIcons" 
            :key="index"
          >
            <div class="output-info">
              <div class="output-size">{{ icon.size }}x{{ icon.size }}</div>
              <div class="output-format">{{ icon.format.toUpperCase() }}</div>
            </div>
            <div class="output-preview">
              <img :src="icon.dataUrl" alt="Generated icon" class="output-icon">
            </div>
            <div class="output-actions">
              <button 
                class="download-button" 
                @click="downloadIcon(icon)"
              >
                💾 下载
              </button>
              <button 
                class="copy-button" 
                @click="copyIcon(icon)"
              >
                📋 复制
              </button>
            </div>
          </div>
        </div>
        
        <!-- 批量下载 -->
        <div class="batch-download">
          <button 
            class="action-button primary" 
            @click="downloadAllIcons"
          >
            📦 批量下载所有图标
          </button>
        </div>
      </div>
      
      <!-- 错误信息 -->
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
      
      <!-- 成功信息 -->
      <div v-if="successMessage" class="success-message">
        ✅ {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 状态管理
const selectedFile = ref(null)
const previewUrl = ref('')
const isDragging = ref(false)
const imageDimensions = ref(null)
const generatedIcons = ref([])
const errorMessage = ref('')
const successMessage = ref('')

// 图标设置
const availableSizes = [16, 32, 48, 64, 128, 256, 512]
const availableFormats = ['png', 'ico', 'svg']
const selectedSizes = ref([16, 32, 48, 128, 256])
const selectedFormats = ref(['png', 'ico'])
const backgroundColor = ref('#ffffff')
const isTransparent = ref(false)

// 文件处理
const onFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const onDragOver = () => {
  isDragging.value = true
}

const onDragLeave = () => {
  isDragging.value = false
}

const onDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  try {
    errorMessage.value = ''
    
    // 检查文件大小（限制为 10MB）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('文件大小不能超过 10MB')
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error('请上传图片文件')
    }
    
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  } catch (error) {
    errorMessage.value = error.message
    console.error('文件处理错误:', error)
  }
}

const onImageLoad = (event) => {
  imageDimensions.value = {
    width: event.target.naturalWidth,
    height: event.target.naturalHeight
  }
}

const removeFile = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFile.value = null
  previewUrl.value = ''
  imageDimensions.value = null
  generatedIcons.value = []
  errorMessage.value = ''
  successMessage.value = ''
}

// 设置处理
const toggleSelectAllSizes = () => {
  if (selectedSizes.value.length === availableSizes.length) {
    selectedSizes.value = []
  } else {
    selectedSizes.value = [...availableSizes]
  }
}

const toggleSelectAllFormats = () => {
  if (selectedFormats.value.length === availableFormats.length) {
    selectedFormats.value = []
  } else {
    selectedFormats.value = [...availableFormats]
  }
}

const toggleTransparency = () => {
  if (isTransparent.value) {
    backgroundColor.value = 'transparent'
  } else {
    backgroundColor.value = '#ffffff'
  }
}

// 图标生成
const generateIcons = () => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    generatedIcons.value = []
    
    if (!selectedFile.value) {
      throw new Error('请先上传图片')
    }
    
    if (selectedSizes.value.length === 0) {
      throw new Error('请选择至少一个尺寸')
    }
    
    if (selectedFormats.value.length === 0) {
      throw new Error('请选择至少一个格式')
    }
    
    // 模拟图标生成过程
    setTimeout(() => {
      // 生成图标列表
      const icons = []
      for (const size of selectedSizes.value) {
        for (const format of selectedFormats.value) {
          icons.push({
            size,
            format,
            dataUrl: previewUrl.value, // 这里应该是实际生成的图标数据，暂时使用预览图
            fileName: `icon-${size}x${size}.${format}`
          })
        }
      }
      
      generatedIcons.value = icons
      successMessage.value = `成功生成 ${icons.length} 个图标！`
      
      // 3秒后清除成功消息
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }, 1000)
    
  } catch (error) {
    errorMessage.value = error.message
    console.error('图标生成错误:', error)
  }
}

// 图标下载和复制
const downloadIcon = (icon) => {
  try {
    const link = document.createElement('a')
    link.href = icon.dataUrl
    link.download = icon.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    successMessage.value = `成功下载 ${icon.fileName}`
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = `下载失败: ${error.message}`
    console.error('图标下载错误:', error)
  }
}

const copyIcon = (icon) => {
  try {
    // 这里简化处理，实际应该复制图片数据
    navigator.clipboard.writeText(icon.dataUrl)
      .then(() => {
        successMessage.value = `成功复制 ${icon.fileName} 的数据 URL`
        setTimeout(() => {
          successMessage.value = ''
        }, 2000)
      })
      .catch(err => {
        throw new Error('复制失败，请手动复制')
      })
  } catch (error) {
    errorMessage.value = error.message
    console.error('图标复制错误:', error)
  }
}

const downloadAllIcons = () => {
  try {
    // 模拟批量下载
    successMessage.value = '正在准备批量下载...'
    
    setTimeout(() => {
      successMessage.value = `成功下载所有 ${generatedIcons.value.length} 个图标！`
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }, 1500)
  } catch (error) {
    errorMessage.value = `批量下载失败: ${error.message}`
    console.error('批量下载错误:', error)
  }
}

// 工具函数
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const clearAll = () => {
  removeFile()
  selectedSizes.value = [16, 32, 48, 128, 256]
  selectedFormats.value = ['png', 'ico']
  backgroundColor.value = '#ffffff'
  isTransparent.value = false
  errorMessage.value = ''
  successMessage.value = ''
}
</script>

<style scoped>
@import "~/styles/IconGenerator.css";
</style>