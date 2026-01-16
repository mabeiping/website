<template>
  <div class="data-cleaning-tool-page">
    <h1 class="page-title">数据清洗与整理工具</h1>
    
    <!-- 功能标签页 -->
    <div class="function-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'remove-duplicates' }" 
        @click="activeTab = 'remove-duplicates'"
      >
        去除重复项
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'format-standardization' }" 
        @click="activeTab = 'format-standardization'"
      >
        格式标准化
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'text-splitting' }" 
        @click="activeTab = 'text-splitting'"
      >
        文本分列
      </button>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 去除重复项 -->
      <div v-if="activeTab === 'remove-duplicates'" class="tab-content">
        <h2 class="section-title">去除重复项</h2>
        <div class="input-section">
          <div class="input-methods">
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="duplicateInputMethod" 
                value="paste" 
                name="duplicateInputMethod"
              />
              <span>粘贴文本列表</span>
            </label>
            <label class="radio-option">
              <input 
                type="radio" 
                v-model="duplicateInputMethod" 
                value="upload" 
                name="duplicateInputMethod"
              />
              <span>上传Excel文件</span>
            </label>
          </div>
          
          <!-- 粘贴输入 -->
          <div v-if="duplicateInputMethod === 'paste'" class="paste-input">
            <label class="input-label">请输入或粘贴数据（每行一个）：</label>
            <textarea 
              class="data-textarea" 
              v-model="duplicateInputData" 
              placeholder="请输入或粘贴数据，每行一个..."
              rows="10"
            ></textarea>
          </div>
          
          <!-- 文件上传 -->
          <div v-else class="file-upload">
            <label class="file-label">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                @change="handleExcelUpload($event, 'duplicates')"
              />
              <span class="file-button">选择Excel文件</span>
              <span v-if="duplicateUploadedFile" class="file-name">{{ duplicateUploadedFile.name }}</span>
            </label>
          </div>
          
          <div class="action-buttons">
            <button class="process-button" @click="removeDuplicates">
              <span class="icon">🧹</span> 去除重复项
            </button>
            <button class="clear-button" @click="clearDuplicateData" :disabled="!duplicateInputData && !duplicateUploadedFile">
              <span class="icon">🗑️</span> 清空
            </button>
          </div>
        </div>
        
        <!-- 结果展示 -->
        <div v-if="duplicateResults.length > 0" class="results-section">
          <h3 class="results-title">
            处理结果：共 {{ duplicateResults.length }} 条记录（去除了 {{ duplicateInputList.length - duplicateResults.length }} 条重复项）
            <div class="result-actions">
              <button class="copy-button" @click="copyResults(duplicateResults)">
                <span class="icon">📋</span> 复制结果
              </button>
              <button class="export-button" @click="exportResults(duplicateResults, '去重数据')">
                <span class="icon">📄</span> 导出结果
              </button>
            </div>
          </h3>
          <div class="results-container">
            <div class="results-list">
              <div 
                v-for="(item, index) in duplicateResults" 
                :key="index" 
                class="result-item"
              >
                <span class="result-index">{{ index + 1 }}.</span>
                <span class="result-value">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 格式标准化 -->
      <div v-if="activeTab === 'format-standardization'" class="tab-content">
        <h2 class="section-title">格式标准化</h2>
        <div class="input-section">
          <div class="format-type-selector">
            <label class="setting-label">标准化类型</label>
            <select class="setting-input" v-model="standardizationType">
              <option value="phone">手机号</option>
              <option value="date">日期</option>
              <option value="id-card">身份证号</option>
            </select>
          </div>
          
          <!-- 手机号标准化选项 -->
          <div v-if="standardizationType === 'phone'" class="format-options">
            <div class="checkbox-option">
              <label>
                <input type="checkbox" v-model="phoneOptions.complete11Digits" />
                <span>补全11位</span>
              </label>
            </div>
            <div class="checkbox-option">
              <label>
                <input type="checkbox" v-model="phoneOptions.removeSpaces" />
                <span>去除空格</span>
              </label>
            </div>
          </div>
          
          <!-- 日期标准化选项 -->
          <div v-if="standardizationType === 'date'" class="format-options">
            <label class="setting-label">目标格式</label>
            <select class="setting-input" v-model="dateTargetFormat">
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-15)</option>
              <option value="YYYY.MM.DD">YYYY.MM.DD (2026.01.15)</option>
              <option value="YYYYMMDD">YYYYMMDD (20260115)</option>
            </select>
          </div>
          
          <!-- 身份证号标准化选项 -->
          <div v-if="standardizationType === 'id-card'" class="format-options">
            <div class="checkbox-option">
              <label>
                <input type="checkbox" v-model="idCardOptions.hideMiddle" />
                <span>隐藏中间6位</span>
              </label>
            </div>
          </div>
          
          <div class="paste-input">
            <label class="input-label">请输入或粘贴需要标准化的数据（每行一个）：</label>
            <textarea 
              class="data-textarea" 
              v-model="standardizationInput" 
              placeholder="请输入或粘贴数据，每行一个..."
              rows="10"
            ></textarea>
          </div>
          
          <div class="action-buttons">
            <button class="process-button" @click="standardizeFormat">
              <span class="icon">✨</span> 标准化格式
            </button>
            <button class="clear-button" @click="clearStandardizationData" :disabled="!standardizationInput">
              <span class="icon">🗑️</span> 清空
            </button>
          </div>
        </div>
        
        <!-- 结果展示 -->
        <div v-if="standardizationResults.length > 0" class="results-section">
          <h3 class="results-title">
            标准化结果
            <div class="result-actions">
              <button class="copy-button" @click="copyResults(standardizationResults)">
                <span class="icon">📋</span> 复制结果
              </button>
              <button class="export-button" @click="exportResults(standardizationResults, '标准化数据')">
                <span class="icon">📄</span> 导出结果
              </button>
            </div>
          </h3>
          <div class="results-container">
            <div class="results-list">
              <div 
                v-for="(item, index) in standardizationResults" 
                :key="index" 
                class="result-item"
              >
                <span class="result-index">{{ index + 1 }}.</span>
                <span class="result-original">{{ standardizationInputList[index] }}</span>
                <span class="result-arrow">→</span>
                <span class="result-standardized">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 文本分列 -->
      <div v-if="activeTab === 'text-splitting'" class="tab-content">
        <h2 class="section-title">文本分列</h2>
        <div class="input-section">
          <div class="delimiter-section">
            <label class="setting-label">分隔符</label>
            <div class="delimiter-options">
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="delimiterType" 
                  value="comma" 
                  name="delimiterType"
                />
                <span>逗号 (,)</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="delimiterType" 
                  value="space" 
                  name="delimiterType"
                />
                <span>空格</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="delimiterType" 
                  value="tab" 
                  name="delimiterType"
                />
                <span>制表符</span>
              </label>
              <label class="radio-option">
                <input 
                  type="radio" 
                  v-model="delimiterType" 
                  value="custom" 
                  name="delimiterType"
                />
                <span>自定义</span>
              </label>
            </div>
            <div v-if="delimiterType === 'custom'" class="custom-delimiter">
              <input 
                type="text" 
                class="custom-delimiter-input" 
                v-model="customDelimiter" 
                placeholder="请输入自定义分隔符"
                maxlength="1"
              />
            </div>
          </div>
          
          <div class="paste-input">
            <label class="input-label">请输入或粘贴需要分列的数据（每行一个）：</label>
            <textarea 
              class="data-textarea" 
              v-model="splitInputData" 
              placeholder="请输入或粘贴数据，每行一个..."
              rows="10"
            ></textarea>
          </div>
          
          <div class="action-buttons">
            <button class="process-button" @click="splitText">
              <span class="icon">✂️</span> 执行分列
            </button>
            <button class="clear-button" @click="clearSplitData" :disabled="!splitInputData">
              <span class="icon">🗑️</span> 清空
            </button>
          </div>
        </div>
        
        <!-- 结果展示 -->
        <div v-if="splitResults.length > 0" class="results-section">
          <h3 class="results-title">
            分列结果
            <div class="result-actions">
              <button class="copy-button" @click="copySplitResults">
                <span class="icon">📋</span> 复制结果
              </button>
              <button class="export-button" @click="exportSplitResults">
                <span class="icon">📄</span> 导出结果
              </button>
            </div>
          </h3>
          <div class="results-container">
            <div class="split-results-table">
              <table>
                <thead>
                  <tr>
                    <th>行号</th>
                    <th v-for="(col, index) in maxColumns" :key="index">列{{ index + 1 }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in splitResults" :key="rowIndex">
                    <td class="row-number">{{ rowIndex + 1 }}</td>
                    <td v-for="(col, colIndex) in row" :key="colIndex">{{ col }}</td>
                    <td v-for="empty in maxColumns - row.length" :key="`empty-${rowIndex}-${empty}`"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 响应式状态
const activeTab = ref('remove-duplicates')

// 去除重复项
const duplicateInputMethod = ref('paste')
const duplicateInputData = ref('')
const duplicateUploadedFile = ref(null)
const duplicateResults = ref([])

// 格式标准化
const standardizationType = ref('phone')
const standardizationInput = ref('')
const standardizationResults = ref([])

const phoneOptions = ref({
  complete11Digits: true,
  removeSpaces: true
})

const dateTargetFormat = ref('YYYY-MM-DD')

const idCardOptions = ref({
  hideMiddle: true
})

// 文本分列
const delimiterType = ref('comma')
const customDelimiter = ref('')
const splitInputData = ref('')
const splitResults = ref([])

// 计算属性：获取分隔符
const currentDelimiter = computed(() => {
  switch (delimiterType.value) {
    case 'comma': return ','
    case 'space': return ' '
    case 'tab': return '\t'
    case 'custom': return customDelimiter.value
    default: return ','
  }
})

// 计算属性：输入列表（去除重复项）
const duplicateInputList = computed(() => {
  return duplicateInputData.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item !== '')
})

// 计算属性：输入列表（格式标准化）
const standardizationInputList = computed(() => {
  return standardizationInput.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item !== '')
})

// 计算属性：最大列数（文本分列）
const maxColumns = computed(() => {
  if (splitResults.value.length === 0) return 0
  return Math.max(...splitResults.value.map(row => row.length))
})

// 处理Excel文件上传
const handleExcelUpload = (event, type) => {
  const file = event.target.files[0]
  if (type === 'duplicates') {
    duplicateUploadedFile.value = file
    // 这里可以添加Excel文件解析逻辑
  }
  // 可以添加其他类型的文件处理
}

// 去除重复项
const removeDuplicates = () => {
  const inputList = duplicateInputList.value
  const uniqueSet = new Set(inputList)
  duplicateResults.value = Array.from(uniqueSet)
}

// 清空去重数据
const clearDuplicateData = () => {
  duplicateInputData.value = ''
  duplicateUploadedFile.value = null
  duplicateResults.value = []
}

// 标准化格式
const standardizeFormat = () => {
  const inputList = standardizationInputList.value
  const results = []
  
  inputList.forEach(item => {
    let standardized = item
    
    switch (standardizationType.value) {
      case 'phone':
        standardized = item.replace(/\s/g, '') // 先去除所有空格
        if (phoneOptions.value.removeSpaces) {
          standardized = standardized.replace(/\s/g, '')
        }
        if (phoneOptions.value.complete11Digits && standardized.length === 10) {
          standardized = '1' + standardized
        }
        break
        
      case 'date':
        // 简单的日期格式转换，实际项目中可能需要更复杂的处理
        standardized = item
          .replace(/\./g, '-')
          .replace(/\//g, '-')
        // 这里可以添加更多日期格式处理逻辑
        break
        
      case 'id-card':
        if (idCardOptions.value.hideMiddle && standardized.length === 18) {
          standardized = standardized.replace(/(\d{6})\d{6}(\d{6})/, '$1******$2')
        }
        break
    }
    
    results.push(standardized)
  })
  
  standardizationResults.value = results
}

// 清空标准化数据
const clearStandardizationData = () => {
  standardizationInput.value = ''
  standardizationResults.value = []
}

// 文本分列
const splitText = () => {
  const inputList = splitInputData.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item !== '')
  
  const results = inputList.map(item => {
    return item.split(currentDelimiter.value)
      .map(col => col.trim())
  })
  
  splitResults.value = results
}

// 清空分列数据
const clearSplitData = () => {
  splitInputData.value = ''
  splitResults.value = []
}

// 复制结果
const copyResults = (results) => {
  const text = results.join('\n')
  navigator.clipboard.writeText(text)
}

// 导出结果
const exportResults = (results, filenamePrefix) => {
  const text = results.join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 复制分列结果
const copySplitResults = () => {
  const text = splitResults.value
    .map(row => row.join('\t'))
    .join('\n')
  navigator.clipboard.writeText(text)
}

// 导出分列结果
const exportSplitResults = () => {
  const text = splitResults.value
    .map(row => row.join(','))
    .join('\n')
  const blob = new Blob([text], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `split-results-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.data-cleaning-tool-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

/* 功能标签页 */
.function-tabs {
  display: flex;
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-button.active {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active:hover {
  color: white;
}

/* 内容区域 */
.content-area {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.tab-content {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* 输入区域 */
.input-section {
  margin-bottom: 2rem;
}

.input-methods,
.format-type-selector,
.delimiter-section,
.format-options {
  margin-bottom: 1.5rem;
}

.input-label,
.setting-label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  user-select: none;
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  accent-color: var(--color-primary);
}

.radio-option:last-child,
.checkbox-option:last-child {
  margin-bottom: 0;
}

/* 文本输入 */
.data-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 200px;
  transition: all 0.3s ease;
}

.data-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 文件上传 */
.file-upload {
  margin: 1rem 0;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.file-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.file-button:hover {
  background-color: var(--color-primary-hover);
}

.file-name {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

.file-label input[type="file"] {
  display: none;
}

/* 设置输入 */
.setting-input,
.custom-delimiter-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
  transition: all 0.3s ease;
}

.setting-input:focus,
.custom-delimiter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-delimiter {
  margin-top: 0.75rem;
}

.custom-delimiter-input {
  width: 100px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.process-button,
.clear-button,
.copy-button,
.export-button {
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

.process-button {
  background-color: var(--color-primary);
  color: white;
}

.process-button:hover {
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
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.results-title {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-actions {
  display: flex;
  gap: 0.75rem;
}

.copy-button,
.export-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background-color: var(--color-primary);
  color: white;
}

.copy-button:hover,
.export-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.results-container {
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  padding: 1rem;
  border: 1px solid var(--color-border);
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
  background-color: var(--color-bg-secondary);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.result-item:hover {
  background-color: var(--color-bg-tertiary);
}

.result-index {
  font-weight: 600;
  color: var(--color-text-muted);
  min-width: 3rem;
}

.result-value,
.result-original,
.result-standardized {
  flex: 1;
  font-size: 0.95rem;
}

.result-arrow {
  color: var(--color-text-muted);
  font-weight: 600;
}

.result-original {
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.result-standardized {
  color: var(--color-primary);
  font-weight: 500;
}

/* 分列结果表格 */
.split-results-table {
  overflow-x: auto;
}

.split-results-table table {
  width: 100%;
  border-collapse: collapse;
}

.split-results-table th,
.split-results-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid var(--color-border);
}

.split-results-table th {
  background-color: var(--color-bg-tertiary);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.split-results-table td {
  background-color: white;
}

.split-results-table .row-number {
  font-weight: 600;
  color: var(--color-text-muted);
  background-color: var(--color-bg-secondary);
}

/* 图标样式 */
.icon {
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-cleaning-tool-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .function-tabs {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .tab-button {
    width: 100%;
    text-align: center;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .results-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .result-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .copy-button,
  .export-button {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .process-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }
  
  .radio-option,
  .checkbox-option {
    flex-direction: row;
    align-items: center;
  }
}
</style>