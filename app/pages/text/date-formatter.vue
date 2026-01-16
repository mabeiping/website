<template>
  <div class="date-formatter-page">
    <h1 class="page-title">日期格式化工具</h1>
    
    <div class="tool-container">
      <div class="input-section">
        <div class="section-header">
          <h3>输入日期</h3>
          <button class="btn-secondary" @click="clearInput">清空</button>
        </div>
        <textarea 
          v-model="inputText" 
          class="text-input"
          placeholder="输入日期，每行一个，支持多种格式：&#10;2026-01-15&#10;2026.01.15&#10;20260115&#10;2026年1月15日"
          rows="8"
        ></textarea>
        <div class="text-info">
          <span>行数: {{ inputText.split('\n').filter(l => l.trim()).length }}</span>
        </div>
      </div>
      
      <div class="format-section">
        <h3>目标格式</h3>
        <div class="format-options">
          <label class="format-option" v-for="format in formats" :key="format.value">
            <input type="radio" v-model="selectedFormat" :value="format.value" />
            <span>{{ format.label }}</span>
            <span class="format-example">{{ format.example }}</span>
          </label>
        </div>
      </div>
      
      <div class="action-section">
        <button class="btn-primary" @click="formatDates">格式化</button>
        <button class="btn-secondary" @click="reset">重置</button>
      </div>
      
      <div class="output-section" v-if="outputText">
        <div class="section-header">
          <h3>格式化结果</h3>
          <button class="btn-secondary" @click="copyOutput">复制结果</button>
        </div>
        <textarea 
          v-model="outputText" 
          class="text-input"
          placeholder="格式化后的日期将显示在这里..."
          rows="8"
          readonly
        ></textarea>
        <div class="text-info">
          <span>行数: {{ outputText.split('\n').filter(l => l.trim()).length }}</span>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>支持多种日期格式输入：数字格式、短横线格式、点分隔格式、中文格式</li>
        <li>支持批量格式化：每行一个日期，自动识别格式</li>
        <li>支持格式转换：数字格式 ↔ 中文格式、短横线格式 ↔ 点分隔格式</li>
        <li>实时格式化：选择格式后立即转换</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const selectedFormat = ref('yyyy-MM-dd')

const formats = [
  { value: 'yyyy-MM-dd', label: '短横线格式', example: '2026-01-15' },
  { value: 'yyyy.MM.dd', label: '点分隔格式', example: '2026.01.15' },
  { value: 'yyyyMMdd', label: '数字格式', example: '20260115' },
  { value: 'yyyy年M月d日', label: '中文格式', example: '2026年1月15日' },
  { value: 'yyyy年MM月dd日', label: '中文格式（补零）', example: '2026年01月15日' },
  { value: 'yyyy/MM/dd', label: '斜杠格式', example: '2026/01/15' },
  { value: 'MM/dd/yyyy', label: '美式格式', example: '01/15/2026' },
  { value: 'dd/MM/yyyy', label: '欧式格式', example: '15/01/2026' }
]

// 解析日期字符串
const parseDate = (dateStr) => {
  dateStr = dateStr.trim()
  if (!dateStr) return null
  
  // 尝试多种格式
  let date = null
  
  // 数字格式：20260115
  if (/^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    date = new Date(`${year}-${month}-${day}`)
  }
  // 短横线格式：2026-01-15
  else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)) {
    date = new Date(dateStr)
  }
  // 点分隔格式：2026.01.15
  else if (/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(dateStr)) {
    date = new Date(dateStr.replace(/\./g, '-'))
  }
  // 斜杠格式：2026/01/15
  else if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)) {
    date = new Date(dateStr)
  }
  // 中文格式：2026年1月15日
  else if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(dateStr)) {
    const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
    if (match) {
      date = new Date(`${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`)
    }
  }
  // 美式格式：01/15/2026
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/')
    date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`)
  }
  // 欧式格式：15/01/2026
  else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/')
    date = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`)
  }
  
  // 验证日期有效性
  if (date && !isNaN(date.getTime())) {
    return date
  }
  
  return null
}

// 格式化日期
const formatDate = (date, format) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  const replacements = {
    'yyyy': year.toString(),
    'MM': month.toString().padStart(2, '0'),
    'M': month.toString(),
    'dd': day.toString().padStart(2, '0'),
    'd': day.toString()
  }
  
  let result = format
  Object.keys(replacements).forEach(key => {
    result = result.replace(new RegExp(key, 'g'), replacements[key])
  })
  
  return result
}

const formatDates = () => {
  if (!inputText.value.trim()) {
    alert('请输入日期')
    return
  }
  
  const lines = inputText.value.split('\n')
  const results = []
  
  lines.forEach(line => {
    const date = parseDate(line)
    if (date) {
      results.push(formatDate(date, selectedFormat.value))
    } else if (line.trim()) {
      results.push(`[无法解析: ${line.trim()}]`)
    }
  })
  
  outputText.value = results.join('\n')
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

const reset = () => {
  inputText.value = ''
  outputText.value = ''
  selectedFormat.value = 'yyyy-MM-dd'
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.date-formatter-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.tool-container {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
}

.input-section,
.output-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.text-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Consolas', 'Monaco', monospace;
  resize: vertical;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.text-info {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.format-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.format-section h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.format-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.format-option:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

.format-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.format-option input[type="radio"]:checked + span {
  color: var(--color-primary);
  font-weight: 600;
}

.format-example {
  margin-left: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.action-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary {
  flex: 1;
  padding: 1rem 2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  padding: 1rem 1.5rem;
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: var(--color-gray-300);
  border-color: var(--color-primary);
}

.tool-info {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.tool-info h2 {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.tool-info ul {
  list-style: none;
  padding: 0;
}

.tool-info li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.tool-info li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

@media (max-width: 768px) {
  .date-formatter-page {
    padding: 1rem;
  }
  
  .action-section {
    flex-direction: column;
  }
}
</style>