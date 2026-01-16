<template>
  <div class="json-parser-page">
    <h1 class="page-title">JSON解析工具</h1>
    
    <div class="tool-container">
      <div class="input-section">
        <div class="section-header">
          <h3>输入JSON</h3>
          <div class="action-buttons">
            <button class="btn-secondary" @click="formatJSON">格式化</button>
            <button class="btn-secondary" @click="minifyJSON">压缩</button>
            <button class="btn-secondary" @click="clearInput">清空</button>
          </div>
        </div>
        <textarea 
          v-model="inputJSON" 
          class="text-input"
          placeholder="输入或粘贴JSON字符串..."
          rows="12"
          @input="parseJSON"
        ></textarea>
        <div class="text-info">
          <span>字符数: {{ inputJSON.length }}</span>
          <span>行数: {{ inputJSON.split('\n').length }}</span>
        </div>
      </div>
      
      <div class="result-section" v-if="inputJSON">
        <div class="section-header">
          <h3>解析结果</h3>
          <div class="action-buttons">
            <button class="btn-secondary" @click="copyResult">复制结果</button>
            <button class="btn-secondary" @click="copyFormatted">复制格式化</button>
          </div>
        </div>
        <div v-if="error" class="error-message">
          <strong>解析错误：</strong>
          <pre>{{ error }}</pre>
        </div>
        <div v-else-if="formattedJSON" class="success-message">
          <strong>✓ JSON格式正确</strong>
        </div>
        <textarea 
          v-model="formattedJSON" 
          class="text-input"
          placeholder="格式化后的JSON将显示在这里..."
          rows="12"
          readonly
        ></textarea>
        <div class="json-stats" v-if="jsonStats">
          <div class="stat-item">
            <span class="stat-label">类型：</span>
            <span class="stat-value">{{ jsonStats.type }}</span>
          </div>
          <div class="stat-item" v-if="jsonStats.keys">
            <span class="stat-label">键数量：</span>
            <span class="stat-value">{{ jsonStats.keys }}</span>
          </div>
          <div class="stat-item" v-if="jsonStats.length">
            <span class="stat-label">数组长度：</span>
            <span class="stat-value">{{ jsonStats.length }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>JSON格式化与美化：自动格式化JSON字符串，提高可读性</li>
        <li>语法错误检测：实时检测JSON语法错误并显示错误信息</li>
        <li>支持压缩：将格式化的JSON压缩为单行</li>
        <li>支持复制：一键复制格式化结果</li>
        <li>显示统计信息：显示JSON类型、键数量等统计信息</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const inputJSON = ref('')
const formattedJSON = ref('')
const error = ref('')
const jsonStats = ref(null)

const parseJSON = () => {
  error.value = ''
  jsonStats.value = null
  
  if (!inputJSON.value.trim()) {
    formattedJSON.value = ''
    return
  }
  
  try {
    const parsed = JSON.parse(inputJSON.value)
    formattedJSON.value = JSON.stringify(parsed, null, 2)
    
    // 统计信息
    if (Array.isArray(parsed)) {
      jsonStats.value = {
        type: '数组',
        length: parsed.length
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      jsonStats.value = {
        type: '对象',
        keys: Object.keys(parsed).length
      }
    } else {
      jsonStats.value = {
        type: typeof parsed
      }
    }
  } catch (err) {
    error.value = err.message
    formattedJSON.value = ''
    jsonStats.value = null
  }
}

const formatJSON = () => {
  if (!inputJSON.value.trim()) {
    alert('请输入JSON')
    return
  }
  
  try {
    const parsed = JSON.parse(inputJSON.value)
    inputJSON.value = JSON.stringify(parsed, null, 2)
    parseJSON()
  } catch (err) {
    alert('JSON格式错误：' + err.message)
  }
}

const minifyJSON = () => {
  if (!inputJSON.value.trim()) {
    alert('请输入JSON')
    return
  }
  
  try {
    const parsed = JSON.parse(inputJSON.value)
    inputJSON.value = JSON.stringify(parsed)
    parseJSON()
  } catch (err) {
    alert('JSON格式错误：' + err.message)
  }
}

const clearInput = () => {
  inputJSON.value = ''
  formattedJSON.value = ''
  error.value = ''
  jsonStats.value = null
}

const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(formattedJSON.value)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}

const copyFormatted = async () => {
  try {
    const formatted = JSON.stringify(JSON.parse(inputJSON.value), null, 2)
    await navigator.clipboard.writeText(formatted)
    alert('已复制格式化结果到剪贴板')
  } catch (err) {
    alert('复制失败')
  }
}

watch(inputJSON, () => {
  parseJSON()
})
</script>

<style scoped>
.json-parser-page {
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
.result-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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
  line-height: 1.6;
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

.error-message {
  padding: 1rem;
  background-color: rgba(255, 77, 79, 0.1);
  border-left: 4px solid var(--color-danger);
  border-radius: 4px;
  color: var(--color-danger);
  margin-bottom: 1rem;
}

.error-message pre {
  margin: 0.5rem 0 0 0;
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.success-message {
  padding: 0.75rem 1rem;
  background-color: rgba(82, 196, 26, 0.1);
  border-left: 4px solid var(--color-secondary);
  border-radius: 4px;
  color: var(--color-secondary);
  margin-bottom: 1rem;
}

.json-stats {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.stat-value {
  color: var(--color-primary);
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
  .json-parser-page {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>