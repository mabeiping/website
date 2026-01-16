<template>
  <div class="text-batch-processor-page">
    <h1 class="page-title">文本批量处理小工具</h1>
    
    <div class="tool-container">
      <div class="input-section">
        <div class="section-header">
          <h3>输入文本</h3>
          <div class="action-buttons">
            <button class="btn-secondary" @click="clearInput">清空</button>
            <button class="btn-secondary" @click="pasteFromClipboard">粘贴</button>
          </div>
        </div>
        <textarea 
          v-model="inputText" 
          class="text-input"
          placeholder="在此输入或粘贴需要处理的文本..."
          rows="10"
        ></textarea>
        <div class="text-info">
          <span>字符数: {{ inputText.length }}</span>
          <span>行数: {{ inputText.split('\n').length }}</span>
        </div>
      </div>
      
      <div class="options-section">
        <h3>处理选项</h3>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="options.removeSpaces" />
            <span>去除所有空格</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeLineBreaks" />
            <span>去除换行符</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeEmptyLines" />
            <span>去除空行</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.trimLines" />
            <span>去除每行首尾空格</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.toUpperCase" />
            <span>转换为大写</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.toLowerCase" />
            <span>转换为小写</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.punctuationToCN" />
            <span>英文标点转中文标点</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.punctuationToEN" />
            <span>中文标点转英文标点</span>
          </label>
        </div>
        
        <div class="extract-section">
          <h4>内容提取</h4>
          <div class="extract-options">
            <label class="option-item">
              <input type="checkbox" v-model="extractOptions.phone" />
              <span>提取手机号</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="extractOptions.email" />
              <span>提取邮箱</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="extractOptions.url" />
              <span>提取网址</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button class="btn-primary" @click="processText">处理文本</button>
        <button class="btn-secondary" @click="reset">重置</button>
      </div>
      
      <div class="output-section" v-if="outputText || extractedItems.length > 0">
        <div class="section-header">
          <h3>处理结果</h3>
          <div class="action-buttons">
            <button class="btn-secondary" @click="copyOutput">复制结果</button>
            <button class="btn-secondary" @click="clearOutput">清空</button>
          </div>
        </div>
        <div v-if="extractedItems.length > 0" class="extracted-items">
          <h4>提取的内容：</h4>
          <div class="extracted-list">
            <div v-for="(item, index) in extractedItems" :key="index" class="extracted-item">
              <span class="item-type">{{ item.type }}:</span>
              <span class="item-value">{{ item.value }}</span>
              <button class="copy-item-btn" @click="copyToClipboard(item.value)">复制</button>
            </div>
          </div>
        </div>
        <textarea 
          v-model="outputText" 
          class="text-input"
          placeholder="处理后的文本将显示在这里..."
          rows="10"
          readonly
        ></textarea>
        <div class="text-info">
          <span>字符数: {{ outputText.length }}</span>
          <span>行数: {{ outputText.split('\n').length }}</span>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>格式清理：批量去除文本空格、换行符、多余空行</li>
        <li>标点转换：中英文标点互转</li>
        <li>内容提取：从文本中提取手机号、邮箱、网址</li>
        <li>大小写转换：支持转换为大写或小写</li>
        <li>实时处理：输入文本后立即处理</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const inputText = ref('')
const outputText = ref('')
const extractedItems = ref([])

const options = ref({
  removeSpaces: false,
  removeLineBreaks: false,
  removeEmptyLines: false,
  trimLines: false,
  toUpperCase: false,
  toLowerCase: false,
  punctuationToCN: false,
  punctuationToEN: false
})

const extractOptions = ref({
  phone: false,
  email: false,
  url: false
})

// 标点符号映射
const punctuationMap = {
  CN: {
    ',': '，',
    '.': '。',
    '!': '！',
    '?': '？',
    ';': '；',
    ':': '：',
    '(': '（',
    ')': '）',
    '"': '"',
    '"': '"',
    "'": "'",
    "'": "'"
  },
  EN: {
    '，': ',',
    '。': '.',
    '！': '!',
    '？': '?',
    '；': ';',
    '：': ':',
    '（': '(',
    '）': ')',
    '"': '"',
    '"': '"',
    "'": "'",
    "'": "'"
  }
}

const processText = () => {
  if (!inputText.value) {
    alert('请输入文本')
    return
  }
  
  let result = inputText.value
  extractedItems.value = []
  
  // 提取内容
  if (extractOptions.value.phone) {
    const phoneRegex = /1[3-9]\d{9}/g
    const phones = result.match(phoneRegex) || []
    phones.forEach(phone => {
      extractedItems.value.push({ type: '手机号', value: phone })
    })
  }
  
  if (extractOptions.value.email) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const emails = result.match(emailRegex) || []
    emails.forEach(email => {
      extractedItems.value.push({ type: '邮箱', value: email })
    })
  }
  
  if (extractOptions.value.url) {
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = result.match(urlRegex) || []
    urls.forEach(url => {
      extractedItems.value.push({ type: '网址', value: url })
    })
  }
  
  // 处理文本
  if (options.value.removeSpaces) {
    result = result.replace(/\s+/g, '')
  }
  
  if (options.value.removeLineBreaks) {
    result = result.replace(/\n/g, '')
  }
  
  if (options.value.removeEmptyLines) {
    result = result.replace(/^\s*[\r\n]/gm, '')
  }
  
  if (options.value.trimLines) {
    result = result.split('\n').map(line => line.trim()).join('\n')
  }
  
  if (options.value.toUpperCase) {
    result = result.toUpperCase()
  }
  
  if (options.value.toLowerCase) {
    result = result.toLowerCase()
  }
  
  if (options.value.punctuationToCN) {
    Object.keys(punctuationMap.EN).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), punctuationMap.EN[key])
    })
  }
  
  if (options.value.punctuationToEN) {
    Object.keys(punctuationMap.CN).forEach(key => {
      result = result.replace(new RegExp(key, 'g'), punctuationMap.CN[key])
    })
  }
  
  outputText.value = result
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  extractedItems.value = []
}

const clearOutput = () => {
  outputText.value = ''
  extractedItems.value = []
}

const reset = () => {
  inputText.value = ''
  outputText.value = ''
  extractedItems.value = []
  Object.keys(options.value).forEach(key => {
    options.value[key] = false
  })
  Object.keys(extractOptions.value).forEach(key => {
    extractOptions.value[key] = false
  })
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    alert('无法读取剪贴板，请手动粘贴')
  }
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制')
  } catch (err) {
    alert('复制失败')
  }
}
</script>

<style scoped>
.text-batch-processor-page {
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

.section-header h4 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin: 0 0 0.75rem 0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
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

.options-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.options-section h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.option-item:hover {
  background-color: var(--color-bg-tertiary);
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.extract-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.extract-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.extracted-items {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.extracted-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.extracted-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: var(--color-bg-primary);
  border-radius: 6px;
}

.item-type {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 60px;
}

.item-value {
  flex: 1;
  color: var(--color-text-primary);
  font-family: 'Consolas', 'Monaco', monospace;
}

.copy-item-btn {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.copy-item-btn:hover {
  background-color: var(--color-primary-hover);
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
  .text-batch-processor-page {
    padding: 1rem;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
  }
}
</style>