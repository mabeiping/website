<template>
  <div class="timestamp-converter-page">
    <h1 class="page-title">时间戳转换工具</h1>
    
    <div class="tool-container">
      <div class="converter-section">
        <div class="converter-item">
          <div class="converter-header">
            <h3>时间戳 → 日期时间</h3>
            <button class="btn-secondary" @click="clearTimestamp">清空</button>
          </div>
          <div class="input-group">
            <input 
              v-model.number="timestamp" 
              type="number"
              class="number-input"
              placeholder="输入时间戳（秒或毫秒）"
              @input="timestampToDate"
            />
            <select v-model="timestampUnit" class="unit-select" @change="timestampToDate">
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
          </div>
          <div v-if="dateResult" class="result-box">
            <div class="result-item">
              <span class="result-label">标准格式：</span>
              <span class="result-value">{{ dateResult.standard }}</span>
              <button class="copy-btn" @click="copyToClipboard(dateResult.standard)">复制</button>
            </div>
            <div class="result-item">
              <span class="result-label">中文格式：</span>
              <span class="result-value">{{ dateResult.chinese }}</span>
              <button class="copy-btn" @click="copyToClipboard(dateResult.chinese)">复制</button>
            </div>
            <div class="result-item">
              <span class="result-label">ISO格式：</span>
              <span class="result-value">{{ dateResult.iso }}</span>
              <button class="copy-btn" @click="copyToClipboard(dateResult.iso)">复制</button>
            </div>
          </div>
        </div>
        
        <div class="divider">
          <span>⇄</span>
        </div>
        
        <div class="converter-item">
          <div class="converter-header">
            <h3>日期时间 → 时间戳</h3>
            <button class="btn-secondary" @click="clearDate">清空</button>
          </div>
          <div class="date-input-group">
            <input 
              v-model="dateInput" 
              type="datetime-local"
              class="date-input"
              @input="dateToTimestamp"
            />
            <select v-model="outputTimestampUnit" class="unit-select" @change="dateToTimestamp">
              <option value="seconds">秒</option>
              <option value="milliseconds">毫秒</option>
            </select>
          </div>
          <div v-if="timestampResult" class="result-box">
            <div class="result-item">
              <span class="result-label">时间戳：</span>
              <span class="result-value timestamp-value">{{ timestampResult }}</span>
              <button class="copy-btn" @click="copyToClipboard(timestampResult)">复制</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="current-time-section">
        <h3>当前时间</h3>
        <div class="current-time-info">
          <div class="time-item">
            <span class="time-label">当前时间戳（秒）：</span>
            <span class="time-value">{{ currentTimestamp.seconds }}</span>
            <button class="copy-btn" @click="copyToClipboard(currentTimestamp.seconds)">复制</button>
          </div>
          <div class="time-item">
            <span class="time-label">当前时间戳（毫秒）：</span>
            <span class="time-value">{{ currentTimestamp.milliseconds }}</span>
            <button class="copy-btn" @click="copyToClipboard(currentTimestamp.milliseconds)">复制</button>
          </div>
          <div class="time-item">
            <span class="time-label">当前日期时间：</span>
            <span class="time-value">{{ currentDateTime }}</span>
            <button class="copy-btn" @click="copyToClipboard(currentDateTime)">复制</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>时间戳转日期：支持秒和毫秒时间戳转换为日期时间</li>
        <li>日期转时间戳：选择日期时间转换为时间戳</li>
        <li>实时转换：输入后立即显示转换结果</li>
        <li>多种格式：支持标准格式、中文格式、ISO格式</li>
        <li>一键复制：快速复制转换结果</li>
        <li>显示当前时间：实时显示当前时间戳和日期时间</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const timestamp = ref('')
const timestampUnit = ref('seconds')
const dateResult = ref(null)
const dateInput = ref('')
const outputTimestampUnit = ref('seconds')
const timestampResult = ref('')
const currentTime = ref(new Date())

const currentTimestamp = computed(() => {
  const now = currentTime.value.getTime()
  return {
    seconds: Math.floor(now / 1000),
    milliseconds: now
  }
})

const currentDateTime = computed(() => {
  const now = currentTime.value
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
})

const timestampToDate = () => {
  if (!timestamp.value) {
    dateResult.value = null
    return
  }
  
  let timestampValue = Number(timestamp.value)
  
  if (timestampUnit.value === 'seconds') {
    timestampValue = timestampValue * 1000
  }
  
  const date = new Date(timestampValue)
  
  if (isNaN(date.getTime())) {
    dateResult.value = null
    return
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  dateResult.value = {
    standard: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    chinese: `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`,
    iso: date.toISOString()
  }
}

const dateToTimestamp = () => {
  if (!dateInput.value) {
    timestampResult.value = ''
    return
  }
  
  const date = new Date(dateInput.value)
  
  if (isNaN(date.getTime())) {
    timestampResult.value = ''
    return
  }
  
  const timestampValue = date.getTime()
  
  if (outputTimestampUnit.value === 'seconds') {
    timestampResult.value = Math.floor(timestampValue / 1000).toString()
  } else {
    timestampResult.value = timestampValue.toString()
  }
}

const clearTimestamp = () => {
  timestamp.value = ''
  dateResult.value = null
}

const clearDate = () => {
  dateInput.value = ''
  timestampResult.value = ''
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制')
  } catch (err) {
    alert('复制失败')
  }
}

let timer = null

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.timestamp-converter-page {
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

.converter-section {
  margin-bottom: 2rem;
}

.converter-item {
  margin-bottom: 2rem;
}

.converter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.converter-header h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.input-group,
.date-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.number-input,
.date-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.number-input:focus,
.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.unit-select {
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
}

.result-box {
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 100px;
}

.result-value {
  flex: 1;
  color: var(--color-text-primary);
  font-family: 'Consolas', 'Monaco', monospace;
}

.timestamp-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.copy-btn {
  padding: 0.4rem 0.8rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background-color: var(--color-primary-hover);
}

.divider {
  text-align: center;
  margin: 2rem 0;
  font-size: 2rem;
  color: var(--color-primary);
}

.current-time-section {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.current-time-section h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.current-time-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--color-bg-primary);
  border-radius: 6px;
}

.time-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 150px;
}

.time-value {
  flex: 1;
  color: var(--color-text-primary);
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 600;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
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
  .timestamp-converter-page {
    padding: 1rem;
  }
  
  .input-group,
  .date-input-group {
    flex-direction: column;
  }
  
  .result-item,
  .time-item {
    flex-wrap: wrap;
  }
}
</style>