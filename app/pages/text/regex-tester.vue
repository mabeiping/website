<template>
  <div class="regex-tester-page">
    <h1 class="page-title">正则表达式测试工具</h1>
    
    <div class="tool-container">
      <div class="regex-section">
        <div class="section-header">
          <h3>正则表达式</h3>
          <div class="regex-options">
            <label class="option-item">
              <input type="checkbox" v-model="regexFlags.global" />
              <span>g (全局)</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="regexFlags.ignoreCase" />
              <span>i (忽略大小写)</span>
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="regexFlags.multiline" />
              <span>m (多行)</span>
            </label>
          </div>
        </div>
        <input 
          v-model="regexPattern" 
          class="regex-input"
          placeholder="输入正则表达式，例如：\d+、[a-z]+、\w+@\w+\.\w+"
          @input="testRegex"
        />
        <div class="regex-templates">
          <span class="template-label">常用模板：</span>
          <button 
            v-for="template in templates" 
            :key="template.name"
            class="template-btn"
            @click="useTemplate(template)"
          >
            {{ template.name }}
          </button>
        </div>
      </div>
      
      <div class="test-section">
        <div class="section-header">
          <h3>测试文本</h3>
          <button class="btn-secondary" @click="clearTestText">清空</button>
        </div>
        <textarea 
          v-model="testText" 
          class="text-input"
          placeholder="输入要测试的文本..."
          rows="8"
          @input="testRegex"
        ></textarea>
      </div>
      
      <div class="result-section" v-if="regexPattern || testText">
        <h3>匹配结果</h3>
        <div v-if="error" class="error-message">
          <strong>错误：</strong>{{ error }}
        </div>
        <div v-else-if="matches.length > 0" class="matches-container">
          <div class="matches-info">
            <span>找到 {{ matches.length }} 个匹配</span>
            <button class="btn-secondary" @click="copyMatches">复制所有匹配</button>
          </div>
          <div class="matches-list">
            <div 
              v-for="(match, index) in matches" 
              :key="index"
              class="match-item"
            >
              <span class="match-index">{{ index + 1 }}</span>
              <span class="match-text">{{ match.text }}</span>
              <span class="match-position">位置: {{ match.index }}-{{ match.index + match.text.length - 1 }}</span>
            </div>
          </div>
        </div>
        <div v-else-if="regexPattern && testText" class="no-matches">
          未找到匹配项
        </div>
        <div v-if="highlightedText" class="highlighted-text" v-html="highlightedText"></div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>正则表达式编写与测试：输入正则表达式和测试文本</li>
        <li>实时匹配结果展示：显示所有匹配项及其位置</li>
        <li>支持常用正则模板：快速选择常用正则表达式</li>
        <li>支持标志位设置：全局、忽略大小写、多行模式</li>
        <li>高亮显示匹配项：在文本中高亮显示匹配的内容</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const regexPattern = ref('')
const testText = ref('')
const matches = ref([])
const error = ref('')
const highlightedText = ref('')

const regexFlags = ref({
  global: true,
  ignoreCase: false,
  multiline: false
})

const templates = [
  { name: '数字', pattern: '\\d+', desc: '匹配一个或多个数字' },
  { name: '字母', pattern: '[a-zA-Z]+', desc: '匹配一个或多个字母' },
  { name: '邮箱', pattern: '[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}', desc: '匹配邮箱地址' },
  { name: '手机号', pattern: '1[3-9]\\d{9}', desc: '匹配中国手机号' },
  { name: '网址', pattern: 'https?://[\\w.-]+', desc: '匹配网址' },
  { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', desc: '匹配IP地址' },
  { name: '中文', pattern: '[\\u4e00-\\u9fa5]+', desc: '匹配中文字符' },
  { name: '空白行', pattern: '^\\s*$', desc: '匹配空白行' }
]

const useTemplate = (template) => {
  regexPattern.value = template.pattern
  testRegex()
}

const testRegex = () => {
  error.value = ''
  matches.value = []
  highlightedText.value = ''
  
  if (!regexPattern.value) {
    return
  }
  
  if (!testText.value) {
    return
  }
  
  try {
    let flags = ''
    if (regexFlags.value.global) flags += 'g'
    if (regexFlags.value.ignoreCase) flags += 'i'
    if (regexFlags.value.multiline) flags += 'm'
    
    const regex = new RegExp(regexPattern.value, flags)
    const regexGlobal = new RegExp(regexPattern.value, flags + 'g')
    
    // 查找所有匹配
    const allMatches = testText.value.matchAll(regexGlobal)
    matches.value = Array.from(allMatches).map(match => ({
      text: match[0],
      index: match.index
    }))
    
    // 高亮显示
    if (matches.value.length > 0) {
      let highlighted = testText.value
      matches.value.reverse().forEach(match => {
        const before = highlighted.substring(0, match.index)
        const matched = highlighted.substring(match.index, match.index + match.text.length)
        const after = highlighted.substring(match.index + match.text.length)
        highlighted = before + `<mark>${matched}</mark>` + after
      })
      highlightedText.value = highlighted
    } else {
      highlightedText.value = testText.value
    }
  } catch (err) {
    error.value = err.message
    highlightedText.value = testText.value
  }
}

const clearTestText = () => {
  testText.value = ''
  matches.value = []
  highlightedText.value = ''
  error.value = ''
}

const copyMatches = async () => {
  const text = matches.value.map(m => m.text).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    alert('已复制所有匹配项')
  } catch (err) {
    alert('复制失败')
  }
}

watch([regexFlags], () => {
  testRegex()
})
</script>

<style scoped>
.regex-tester-page {
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

.regex-section,
.test-section,
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

.regex-options {
  display: flex;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.option-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.regex-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Consolas', 'Monaco', monospace;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.regex-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.regex-templates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.template-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.template-btn {
  padding: 0.4rem 0.8rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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

.error-message {
  padding: 1rem;
  background-color: rgba(255, 77, 79, 0.1);
  border-left: 4px solid var(--color-danger);
  border-radius: 4px;
  color: var(--color-danger);
  margin-bottom: 1rem;
}

.matches-container {
  margin-bottom: 1rem;
}

.matches-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  border-left: 3px solid var(--color-primary);
}

.match-index {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 30px;
}

.match-text {
  flex: 1;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--color-text-primary);
  word-break: break-all;
}

.match-position {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.no-matches {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.highlighted-text {
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}

.highlighted-text mark {
  background-color: #ffeb3b;
  color: var(--color-text-primary);
  padding: 2px 4px;
  border-radius: 3px;
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
  .regex-tester-page {
    padding: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>