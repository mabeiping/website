<template>
  <div class="page-container">
    <div class="batch-number-generator-page">
      <h1 class="page-title">批量生成编号/编码工具</h1>
    
    <!-- 生成设置 -->
    <div class="generation-settings">
      <h2 class="section-title">生成设置</h2>
      <div class="settings-grid">
        <div class="setting-item">
          <label class="setting-label">生成类型</label>
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="generationType" 
                value="basic" 
                name="generationType"
              />
              <span>基础生成</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="generationType" 
                value="date" 
                name="generationType"
              />
              <span>日期+编号</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="generationType" 
                value="custom" 
                name="generationType"
              />
              <span>自定义格式</span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">前缀</label>
          <input 
            type="text" 
            class="setting-input" 
            v-model="prefix" 
            placeholder="如XM-"
          />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">后缀</label>
          <input 
            type="text" 
            class="setting-input" 
            v-model="suffix" 
            placeholder="如-001"
          />
        </div>
        
        <div v-if="generationType === 'date'" class="setting-item">
          <label class="setting-label">日期格式</label>
          <select class="setting-input" v-model="dateFormat">
            <option value="YYYYMMDD">YYYYMMDD (20260115)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-15)</option>
            <option value="YYYY.MM.DD">YYYY.MM.DD (2026.01.15)</option>
            <option value="YYMMDD">YYMMDD (260115)</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">起始数字</label>
          <input 
            type="number" 
            class="setting-input" 
            v-model.number="startNumber" 
            min="1" 
            placeholder="1"
          />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">位数（补零）</label>
          <input 
            type="number" 
            class="setting-input" 
            v-model.number="digitLength" 
            min="1" 
            max="10" 
            placeholder="3"
          />
        </div>
        
        <div v-if="generationType === 'basic' || generationType === 'date'" class="setting-item">
          <label class="setting-label">递增/递减</label>
          <div class="radio-group">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="incrementType" 
                value="increment" 
                name="incrementType"
              />
              <span>递增</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="incrementType" 
                value="decrement" 
                name="incrementType"
              />
              <span>递减</span>
            </label>
          </div>
        </div>
        
        <div v-if="generationType === 'custom'" class="setting-item">
          <label class="setting-label">自定义格式</label>
          <input 
            type="text" 
            class="setting-input" 
            v-model="customFormat" 
            placeholder="前缀{编号}后缀"
          />
        </div>
        
        <div class="setting-item">
          <label class="setting-label">分隔符</label>
          <select class="setting-input" v-model="separator">
            <option value="">无分隔符</option>
            <option value=",">逗号 (,)</option>
            <option value=";">分号 (;)</option>
            <option value=" ">空格</option>
            <option value="\n">换行</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">编号格式</label>
          <select class="setting-input" v-model="numberFormat">
            <option value="normal">普通 (1, 2, 3...)</option>
            <option value="leading-zero">前导零 (001, 002...)</option>
            <option value="letter">字母编号 (A001, B002...)</option>
          </select>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">生成数量</label>
          <input 
            type="number" 
            class="setting-input" 
            v-model.number="quantity" 
            min="1" 
            max="1000" 
            placeholder="100"
          />
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="generate-button" @click="generateNumbers">
          <span class="icon">✨</span> 生成编号
        </button>
        <button 
          class="clear-button" 
          @click="clearResults" 
          :disabled="!generatedNumbers.length"
        >
          <span class="icon">🗑️</span> 清空
        </button>
      </div>
    </div>
    
    <!-- 生成结果 -->
    <div v-if="generatedNumbers.length > 0" class="results-section">
      <h2 class="section-title">
        生成结果 (共 {{ generatedNumbers.length }} 个)
        <div class="result-actions">
          <button class="copy-all-button" @click="copyAllNumbers">
            <span class="icon">📋</span> 复制全部
          </button>
          <button class="export-button" @click="exportToTxt">
            <span class="icon">📄</span> 导出TXT
          </button>
          <button class="export-button" @click="exportToCsv">
            <span class="icon">📊</span> 导出CSV
          </button>
          <button class="export-button" @click="exportToExcel">
            <span class="icon">📈</span> 导出Excel
          </button>
        </div>
      </h2>
      <div class="results-container">
        <div class="results-list">
          <div 
            v-for="(number, index) in generatedNumbers" 
            :key="index" 
            class="result-item"
          >
            <span class="result-index">{{ index + 1 }}.</span>
            <span class="result-value">{{ number }}</span>
            <button class="copy-item-button" @click="copyNumber(number)">
              <span class="icon">📋</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 预览区域 -->
      <div class="preview-section">
        <h3 class="preview-title">预览</h3>
        <div class="preview-content">
          <div v-for="(number, index) in generatedNumbers.slice(0, 5)" :key="index" class="preview-item">
            {{ number }}
          </div>
          <div v-if="generatedNumbers.length > 5" class="preview-more">
            ... 还有 {{ generatedNumbers.length - 5 }} 个结果
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="generatedNumbers.length === 0" class="empty-state">
      <p>请填写生成设置，点击"生成编号"按钮开始生成</p>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式状态
const generationType = ref('basic')
const prefix = ref('XM-')
const suffix = ref('')
const dateFormat = ref('YYYYMMDD')
const startNumber = ref(1)
const digitLength = ref(3)
const quantity = ref(100)
const incrementType = ref('increment')
const customFormat = ref('')
const separator = ref('')
const numberFormat = ref('normal')
const generatedNumbers = ref([])

// 生成编号
const generateNumbers = () => {
  const numbers = []
  
  for (let i = 0; i < quantity.value; i++) {
    let currentNumber
    
    if (generationType.value === 'basic') {
      currentNumber = startNumber.value + i
    } else if (generationType.value === 'date') {
      currentNumber = startNumber.value + i
    } else if (generationType.value === 'custom') {
      const formatParts = customFormat.value.split('{编号}')
      if (formatParts.length === 2) {
        const prefix = formatParts[0]
        const suffix = formatParts[1]
        currentNumber = `${prefix}${i + 1}${suffix}`
      } else {
        currentNumber = customFormat.value.replace('{编号}', i + 1)
      }
    }
    
    let paddedNumber = String(currentNumber).padStart(digitLength.value, '0')
    
    let number = ''
    
    if (generationType.value === 'date') {
      const datePart = formatDate(new Date(), dateFormat.value)
      number = `${prefix.value}${datePart}-${paddedNumber}`
    } else {
      number = `${prefix.value}${paddedNumber}${suffix.value}`
    }
    
    numbers.push(number)
  }
  
  generatedNumbers.value = numbers
}

// 格式化日期
const formatDate = (date, format) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('YY', String(year).slice(2))
    .replace('MM', month)
    .replace('DD', day)
}

// 复制单个编号
const copyNumber = (number) => {
  navigator.clipboard.writeText(number).then(() => {
    // 可以添加一个提示
  })
}

// 复制全部编号
const copyAllNumbers = () => {
  const text = generatedNumbers.value.join('\n')
  navigator.clipboard.writeText(text).then(() => {
    // 可以添加一个提示
  })
}

// 导出为CSV
const exportToCsv = () => {
  const csvContent = generatedNumbers.value.join(separator.value || ',')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `generated-numbers-${formatDate(new Date(), 'YYYYMMDD')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// 导出为Excel
const exportToExcel = () => {
  const worksheetData = generatedNumbers.value.map((num, index) => ({
  '编号': num
}))

const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '编号列表')
  
  XLSX.writeFile(workbook, `generated-numbers-${formatDate(new Date(), 'YYYYMMDD')}.xlsx`)
}

// 导出为TXT
const exportToTxt = () => {
  let text = generatedNumbers.value.join(separator.value || '\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `generated-numbers-${formatDate(new Date(), 'YYYYMMDD')}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 清空结果
const clearResults = () => {
  generatedNumbers.value = []
}
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
}

.batch-number-generator-page {
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
}

.section-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 设置区域样式 */
.generation-settings {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.setting-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.setting-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 单选按钮组 */
.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  user-select: none;
}

.radio-option input[type="radio"] {
  accent-color: var(--color-primary);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
}

.generate-button,
.clear-button,
.copy-all-button,
.export-button,
.copy-item-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-button {
  background-color: var(--color-primary);
  color: white;
}

.generate-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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

/* 结果区域 */
.results-section {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.result-actions {
  display: flex;
  gap: 0.75rem;
}

.copy-all-button,
.export-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: var(--color-primary);
  color: white;
}

.copy-all-button:hover,
.export-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.results-container {
  max-height: 400px;
  overflow-y: auto;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: white;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.result-item:hover {
  box-shadow: var(--shadow-sm);
}

.result-index {
  font-weight: 600;
  color: var(--color-text-muted);
  min-width: 3rem;
}

.result-value {
  flex: 1;
  font-family: monospace;
  font-size: 1rem;
}

.copy-item-button {
  padding: 0.5rem;
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-radius: 4px;
  font-size: 0.875rem;
  min-width: auto;
}

.copy-item-button:hover {
  background-color: var(--color-bg-quaternary);
}

/* 预览区域 */
.preview-section {
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  padding: 1rem;
}

.preview-title {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-weight: 600;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-item {
  font-family: monospace;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.preview-more {
  color: var(--color-text-muted);
  font-style: italic;
  padding: 0.5rem;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

/* 图标样式 */
.icon {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .batch-number-generator-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .result-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .copy-all-button,
  .export-button {
    width: 100%;
    justify-content: center;
  }
}
</style>