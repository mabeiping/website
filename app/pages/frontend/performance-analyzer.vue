<template>
  <div class="performance-analyzer-container">
    <h1 class="tool-title">性能分析工具</h1>
    <p class="tool-desc">分析网站的加载性能，提供优化建议</p>
    
    <div class="tool-content">
      <!-- 输入区域 -->
      <div class="input-section">
        <h2 class="section-title">输入</h2>
        
        <!-- URL输入 -->
        <div class="url-input-container">
          <input
            type="url"
            v-model="url"
            class="url-input"
            placeholder="请输入要分析的网站URL (例如: https://example.com)"
            @input="handleUrlInput"
          >
          <button 
            class="action-button primary" 
            @click="analyzePerformance"
            :disabled="!isValidUrl"
          >
            📊 开始分析
          </button>
        </div>
        
        <!-- 分析选项 -->
        <div class="analysis-options">
          <h3 class="section-subtitle">分析选项:</h3>
          <div class="options-grid">
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.analyzeImages"
              >
              <span class="option-text">分析图片资源</span>
            </label>
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.analyzeJS"
              >
              <span class="option-text">分析JavaScript文件</span>
            </label>
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.analyzeCSS"
              >
              <span class="option-text">分析CSS文件</span>
            </label>
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.analyzeThirdParty"
              >
              <span class="option-text">分析第三方资源</span>
            </label>
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.generateReport"
              >
              <span class="option-text">生成详细报告</span>
            </label>
            <label class="option-item">
              <input 
                type="checkbox" 
                v-model="options.simulateMobile"
              >
              <span class="option-text">模拟移动设备</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 分析结果区域 -->
      <div class="results-section" v-if="showResults">
        <h2 class="section-title">分析结果</h2>
        
        <!-- 加载状态 -->
        <div v-if="isAnalyzing" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在分析网站性能...</p>
        </div>
        
        <!-- 结果摘要 -->
        <div v-else class="results-summary">
          <div class="summary-card">
            <h3>性能评分</h3>
            <div class="score-display">
              <div class="score-circle" :class="performanceScoreClass">
                <span class="score-value">{{ performanceScore }}</span>
                <span class="score-label">{{ performanceScoreLabel }}</span>
              </div>
            </div>
          </div>
          
          <!-- 关键指标 -->
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-icon">⏱️</div>
              <div class="metric-content">
                <div class="metric-label">首屏加载时间</div>
                <div class="metric-value">{{ metrics.firstContentfulPaint }}s</div>
                <div class="metric-status" :class="getMetricStatus(metrics.firstContentfulPaint, 2)">
                  {{ getMetricStatusText(metrics.firstContentfulPaint, 2) }}
                </div>
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-icon">⚡</div>
              <div class="metric-content">
                <div class="metric-label">可交互时间</div>
                <div class="metric-value">{{ metrics.timeToInteractive }}s</div>
                <div class="metric-status" :class="getMetricStatus(metrics.timeToInteractive, 3.8)">
                  {{ getMetricStatusText(metrics.timeToInteractive, 3.8) }}
                </div>
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-icon">📦</div>
              <div class="metric-content">
                <div class="metric-label">总资源大小</div>
                <div class="metric-value">{{ formatFileSize(metrics.totalSize) }}</div>
                <div class="metric-status" :class="getMetricStatus(metrics.totalSize, 2000000)">
                  {{ getMetricStatusText(metrics.totalSize, 2000000, 'size') }}
                </div>
              </div>
            </div>
            
            <div class="metric-item">
              <div class="metric-icon">🔗</div>
              <div class="metric-content">
                <div class="metric-label">请求数量</div>
                <div class="metric-value">{{ metrics.totalRequests }}</div>
                <div class="metric-status" :class="getMetricStatus(metrics.totalRequests, 50)">
                  {{ getMetricStatusText(metrics.totalRequests, 50, 'count') }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 资源详情 -->
          <div class="resources-section">
            <h3 class="section-subtitle">资源详情:</h3>
            
            <div class="resource-tabs">
              <button 
                class="tab-button" 
                :class="{ active: activeResourceTab === 'images' }" 
                @click="activeResourceTab = 'images'"
              >
                🖼️ 图片 ({{ resources.images.length }})
              </button>
              <button 
                class="tab-button" 
                :class="{ active: activeResourceTab === 'js' }" 
                @click="activeResourceTab = 'js'"
              >
                📜 JavaScript ({{ resources.js.length }})
              </button>
              <button 
                class="tab-button" 
                :class="{ active: activeResourceTab === 'css' }" 
                @click="activeResourceTab = 'css'"
              >
                🎨 CSS ({{ resources.css.length }})
              </button>
              <button 
                class="tab-button" 
                :class="{ active: activeResourceTab === 'third-party' }" 
                @click="activeResourceTab = 'third-party'"
              >
                🌐 第三方资源 ({{ resources.thirdParty.length }})
              </button>
            </div>
            
            <!-- 资源列表 -->
            <div class="resource-list">
              <!-- 图片资源 -->
              <div v-if="activeResourceTab === 'images'" class="resource-items">
                <div 
                  class="resource-item" 
                  v-for="(resource, index) in resources.images" 
                  :key="index"
                >
                  <div class="resource-info">
                    <div class="resource-name">{{ resource.name }}</div>
                    <div class="resource-size">{{ formatFileSize(resource.size) }}</div>
                  </div>
                  <div class="resource-status" :class="resource.status">
                    {{ resource.statusText }}
                  </div>
                </div>
              </div>
              
              <!-- JavaScript资源 -->
              <div v-if="activeResourceTab === 'js'" class="resource-items">
                <div 
                  class="resource-item" 
                  v-for="(resource, index) in resources.js" 
                  :key="index"
                >
                  <div class="resource-info">
                    <div class="resource-name">{{ resource.name }}</div>
                    <div class="resource-size">{{ formatFileSize(resource.size) }}</div>
                  </div>
                  <div class="resource-status" :class="resource.status">
                    {{ resource.statusText }}
                  </div>
                </div>
              </div>
              
              <!-- CSS资源 -->
              <div v-if="activeResourceTab === 'css'" class="resource-items">
                <div 
                  class="resource-item" 
                  v-for="(resource, index) in resources.css" 
                  :key="index"
                >
                  <div class="resource-info">
                    <div class="resource-name">{{ resource.name }}</div>
                    <div class="resource-size">{{ formatFileSize(resource.size) }}</div>
                  </div>
                  <div class="resource-status" :class="resource.status">
                    {{ resource.statusText }}
                  </div>
                </div>
              </div>
              
              <!-- 第三方资源 -->
              <div v-if="activeResourceTab === 'third-party'" class="resource-items">
                <div 
                  class="resource-item" 
                  v-for="(resource, index) in resources.thirdParty" 
                  :key="index"
                >
                  <div class="resource-info">
                    <div class="resource-name">{{ resource.name }}</div>
                    <div class="resource-size">{{ formatFileSize(resource.size) }}</div>
                  </div>
                  <div class="resource-status" :class="resource.status">
                    {{ resource.statusText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 优化建议 -->
          <div class="suggestions-section">
            <h3 class="section-subtitle">优化建议:</h3>
            <div class="suggestions-list">
              <div 
                class="suggestion-item" 
                v-for="(suggestion, index) in suggestions" 
                :key="index"
              >
                <div class="suggestion-icon">{{ suggestion.icon }}</div>
                <div class="suggestion-content">
                  <div class="suggestion-title">{{ suggestion.title }}</div>
                  <div class="suggestion-description">{{ suggestion.description }}</div>
                  <div class="suggestion-impact" :class="suggestion.impact">
                    影响: {{ suggestion.impact.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button 
              class="action-button secondary" 
              @click="exportReport"
            >
              💾 导出报告
            </button>
            <button 
              class="action-button tertiary" 
              @click="clearAll"
            >
              🗑️ 清空
            </button>
          </div>
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
import { ref, computed } from 'vue'

// 状态管理
const url = ref('')
const showResults = ref(false)
const isAnalyzing = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 分析选项
const options = ref({
  analyzeImages: true,
  analyzeJS: true,
  analyzeCSS: true,
  analyzeThirdParty: true,
  generateReport: true,
  simulateMobile: false
})

// 性能评分
const performanceScore = ref(0)
const performanceScoreClass = ref('')
const performanceScoreLabel = ref('')

// 关键指标
const metrics = ref({
  firstContentfulPaint: 0,
  timeToInteractive: 0,
  totalSize: 0,
  totalRequests: 0
})

// 资源详情
const resources = ref({
  images: [],
  js: [],
  css: [],
  thirdParty: []
})

// 优化建议
const suggestions = ref([])

// 资源标签
const activeResourceTab = ref('images')

// 计算有效的URL
const isValidUrl = computed(() => {
  try {
    new URL(url.value)
    return true
  } catch {
    return false
  }
})

// URL输入处理
const handleUrlInput = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

// 分析性能
const analyzePerformance = () => {
  if (!isValidUrl.value) {
    errorMessage.value = '请输入有效的URL'
    return
  }
  
  try {
    showResults.value = false
    errorMessage.value = ''
    isAnalyzing.value = true
    
    // 模拟性能分析
    setTimeout(() => {
      // 生成随机性能数据
      generateMockPerformanceData()
      isAnalyzing.value = false
      showResults.value = true
      successMessage.value = '性能分析完成'
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    }, 2000)
    
  } catch (error) {
    isAnalyzing.value = false
    errorMessage.value = `分析失败: ${error.message}`
    console.error('性能分析错误:', error)
  }
}

// 生成模拟性能数据
const generateMockPerformanceData = () => {
  // 生成随机性能评分 (0-100)
  const score = Math.floor(Math.random() * 40) + 60
  performanceScore.value = score
  
  // 设置评分等级
  if (score >= 90) {
    performanceScoreClass.value = 'excellent'
    performanceScoreLabel.value = '优秀'
  } else if (score >= 75) {
    performanceScoreClass.value = 'good'
    performanceScoreLabel.value = '良好'
  } else if (score >= 60) {
    performanceScoreClass.value = 'average'
    performanceScoreLabel.value = '一般'
  } else {
    performanceScoreClass.value = 'poor'
    performanceScoreLabel.value = '较差'
  }
  
  // 生成关键指标
  metrics.value = {
    firstContentfulPaint: (Math.random() * 2 + 1).toFixed(2),
    timeToInteractive: (Math.random() * 3 + 2).toFixed(2),
    totalSize: Math.floor(Math.random() * 3000000) + 1000000,
    totalRequests: Math.floor(Math.random() * 50) + 30
  }
  
  // 生成资源数据
  generateMockResources()
  
  // 生成优化建议
  generateMockSuggestions()
}

// 生成模拟资源数据
const generateMockResources = () => {
  // 模拟图片资源
  resources.value.images = Array.from({ length: 10 }, (_, i) => ({
    name: `image-${i + 1}.jpg`,
    size: Math.floor(Math.random() * 500000) + 50000,
    status: Math.random() > 0.5 ? 'good' : 'warning',
    statusText: Math.random() > 0.5 ? '已优化' : '建议压缩'
  }))
  
  // 模拟JavaScript资源
  resources.value.js = Array.from({ length: 8 }, (_, i) => ({
    name: `script-${i + 1}.js`,
    size: Math.floor(Math.random() * 200000) + 50000,
    status: Math.random() > 0.6 ? 'good' : 'warning',
    statusText: Math.random() > 0.6 ? '已优化' : '建议压缩'
  }))
  
  // 模拟CSS资源
  resources.value.css = Array.from({ length: 5 }, (_, i) => ({
    name: `style-${i + 1}.css`,
    size: Math.floor(Math.random() * 100000) + 20000,
    status: Math.random() > 0.7 ? 'good' : 'warning',
    statusText: Math.random() > 0.7 ? '已优化' : '建议压缩'
  }))
  
  // 模拟第三方资源
  resources.value.thirdParty = Array.from({ length: 6 }, (_, i) => ({
    name: `third-party-${i + 1}.js`,
    size: Math.floor(Math.random() * 150000) + 30000,
    status: Math.random() > 0.4 ? 'warning' : 'error',
    statusText: Math.random() > 0.4 ? '建议延迟加载' : '建议优化'
  }))
}

// 生成模拟优化建议
const generateMockSuggestions = () => {
  suggestions.value = [
    {
      icon: '🖼️',
      title: '优化图片资源',
      description: '压缩并优化图片资源，使用WebP等现代格式，实现懒加载',
      impact: 'high'
    },
    {
      icon: '📜',
      title: '压缩JavaScript文件',
      description: '使用工具压缩JavaScript文件，移除不必要的代码',
      impact: 'high'
    },
    {
      icon: '🎨',
      title: '优化CSS资源',
      description: '压缩CSS文件，移除未使用的样式，使用CSS变量',
      impact: 'medium'
    },
    {
      icon: '🌐',
      title: '优化第三方资源',
      description: '减少第三方脚本数量，实现异步加载和延迟加载',
      impact: 'high'
    },
    {
      icon: '⚡',
      title: '启用浏览器缓存',
      description: '设置适当的缓存头，利用浏览器缓存机制',
      impact: 'medium'
    },
    {
      icon: '🚀',
      title: '使用CDN加速',
      description: '将静态资源部署到CDN，提高全球访问速度',
      impact: 'medium'
    }
  ]
}

// 获取指标状态
const getMetricStatus = (value, threshold, type = 'time') => {
  value = parseFloat(value)
  if (type === 'time') {
    if (value <= threshold * 0.7) return 'good'
    if (value <= threshold) return 'warning'
    return 'error'
  } else if (type === 'size') {
    if (value <= threshold * 0.7) return 'good'
    if (value <= threshold) return 'warning'
    return 'error'
  } else if (type === 'count') {
    if (value <= threshold * 0.7) return 'good'
    if (value <= threshold) return 'warning'
    return 'error'
  }
  return 'warning'
}

// 获取指标状态文本
const getMetricStatusText = (value, threshold, type = 'time') => {
  const status = getMetricStatus(value, threshold, type)
  if (status === 'good') return '优秀'
  if (status === 'warning') return '一般'
  return '较差'
}

// 导出报告
const exportReport = () => {
  try {
    // 模拟导出报告
    successMessage.value = '报告导出成功'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = `导出失败: ${error.message}`
    console.error('导出报告错误:', error)
  }
}

// 清空所有
const clearAll = () => {
  url.value = ''
  showResults.value = false
  performanceScore.value = 0
  metrics.value = {
    firstContentfulPaint: 0,
    timeToInteractive: 0,
    totalSize: 0,
    totalRequests: 0
  }
  resources.value = {
    images: [],
    js: [],
    css: [],
    thirdParty: []
  }
  suggestions.value = []
  errorMessage.value = ''
  successMessage.value = ''
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
@import "~/styles/PerformanceAnalyzer.css";
</style>