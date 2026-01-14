<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <div class="regex-page">
    <h1 class="page-title">正则表达式替换工具</h1>
    
    <!-- 工具说明 -->
    <div class="tool-description">
      <p>使用正则表达式替换文本中的匹配内容，支持实时预览替换结果。</p>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-section">
      <div class="input-row">
        <div class="input-group">
          <label for="regex-input">正则表达式</label>
          <div class="regex-input-container">
            <input 
              type="text" 
              id="regex-input" 
              v-model="regex" 
              placeholder="输入正则表达式，如：\\d{3}-\\d{3}-\\d{4}"
              class="regex-input"
            >
            <div class="regex-flags">
              <label><input type="checkbox" v-model="flags.g" id="global-flag"> g (全局替换)</label>
              <label><input type="checkbox" v-model="flags.i" id="ignorecase-flag"> i (忽略大小写)</label>
              <label><input type="checkbox" v-model="flags.m" id="multiline-flag"> m (多行模式)</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-row">
        <div class="input-group full-width">
          <label for="replace-with">替换为</label>
          <input 
            type="text" 
            id="replace-with" 
            v-model="replaceWith" 
            placeholder="输入替换文本，如：***-***-$4"
            class="replace-with-input"
          >
        </div>
      </div>
      
      <div class="input-row">
        <div class="input-group full-width">
          <label for="test-text">原始文本</label>
          <textarea 
            id="test-text" 
            v-model="testText" 
            placeholder="输入要处理的文本内容..."
            class="test-text"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    
    <!-- 替换结果区域 -->
    <div class="results-section">
      <div class="results-header">
        <h2>替换结果</h2>
        <div class="results-actions">
          <button @click="copyResult" :disabled="!resultText" class="btn btn-primary">
            复制结果
          </button>
          <button @click="exportResult" :disabled="!resultText" class="btn btn-secondary">
            导出结果
          </button>
          <button @click="swapText" :disabled="!resultText" class="btn btn-outline">
            交换文本
          </button>
        </div>
      </div>
      
      <!-- 匹配统计 -->
      <div class="match-stats" v-if="matchCount > 0">
        <p>已替换 <strong>{{ matchCount }}</strong> 个匹配项</p>
      </div>
      
      <!-- 结果文本 -->
      <div class="result-text-container">
        <textarea 
          v-model="resultText" 
          placeholder="替换结果将显示在这里..."
          class="result-text"
          rows="3"
          readonly
        ></textarea>
      </div>
      
      <!-- 正则表达式错误提示 -->
      <div class="regex-error" v-if="regexError">
        <p>{{ regexError }}</p>
      </div>
      
      <!-- 无匹配结果提示 -->
      <div class="no-matches" v-else-if="regex && testText && matchCount === 0">
        <p>没有找到匹配的内容</p>
      </div>
    </div>
    
    <!-- 常用替换模板 -->
    <div class="templates-section">
      <h2>常用替换模板</h2>
      <div class="templates-grid">
        <div 
          v-for="template in templates" 
          :key="template.id" 
          class="template-item"
          @click="applyTemplate(template)"
        >
          <h3>{{ template.name }}</h3>
          <div class="template-item-content">
            <div class="template-info">
              <div><strong>正则：</strong><code>{{ template.pattern }}</code></div>
              <div><strong>替换：</strong><code>{{ template.replace }}</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 个人简介区域 - 独立在section之外 -->
  <ProfileAside />
</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import ProfileAside from '../../components/ProfileAside.vue'

// 正则表达式相关状态
const regex = ref('')
const replaceWith = ref('')
const testText = ref('')
const flags = ref({
  g: true,
  i: false,
  m: false
})
const regexError = ref('')
const resultText = ref('')
const matchCount = ref(0)

// 常用替换模板
const templates = [
  {
    id: 'remove-spaces',
    name: '移除所有空格',
    pattern: '\\s+',
    replace: '',
    description: '移除文本中所有空格字符'
  },
  {
    id: 'normalize-spaces',
    name: '标准化空格',
    pattern: '\\s+',
    replace: ' ',
    description: '将连续空格替换为单个空格'
  },
  {
    id: 'add-https',
    name: '添加HTTPS前缀',
    pattern: '^(www\\.)',
    replace: 'https://$1',
    description: '为网址添加HTTPS前缀'
  },
  {
    id: 'capitalize',
    name: '首字母大写',
    pattern: '\\b(\\w)(\\w*)\\b',
    replace: '$1'.toUpperCase() + '$2',
    description: '将每个单词首字母大写'
  },
  {
    id: 'remove-html',
    name: '移除HTML标签',
    pattern: '<[^>]+>',
    replace: '',
    description: '移除文本中的所有HTML标签'
  },
  {
    id: 'extract-emails',
    name: '提取邮箱地址',
    pattern: '.*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}).*?',
    replace: '$1\\n',
    description: '从文本中提取所有邮箱地址'
  },
  {
    id: 'format-phone',
    name: '格式化电话号码',
    pattern: '(\\d{3})(\\d{3})(\\d{4})',
    replace: '$1-$2-$3',
    description: '将1234567890格式化为123-456-7890'
  },
  {
    id: 'remove-duplicates',
    name: '移除重复行',
    pattern: '(.*)(\\r?\\n\\1)+$',
    replace: '$1',
    description: '移除文本中的重复行'
  },
  {
    id: 'remove-newlines',
    name: '移除换行符',
    pattern: '\\r?\\n',
    replace: '',
    description: '移除所有换行符'
  },
  {
    id: 'replace-newlines',
    name: '替换换行符',
    pattern: '\\r?\\n',
    replace: ' ',
    description: '将换行符替换为空格'
  },
  {
    id: 'remove-tabs',
    name: '移除制表符',
    pattern: '\\t',
    replace: '',
    description: '移除所有制表符'
  },
  {
    id: 'remove-punctuation',
    name: '移除标点符号',
    pattern: '[.,!?;:，。！？；：]',
    replace: '',
    description: '移除常见标点符号'
  },
  {
    id: 'add-line-numbers',
    name: '添加行号',
    pattern: '^',
    replace: '$& ',
    description: '为每行添加行号（需要配合其他工具）'
  },
  {
    id: 'wrap-in-quotes',
    name: '用引号包裹',
    pattern: '^(.+)$',
    replace: '"$1"',
    description: '用双引号包裹每行'
  },
  {
    id: 'escape-html',
    name: '转义HTML',
    pattern: '&',
    replace: '&amp;',
    description: '转义HTML特殊字符'
  },
  {
    id: 'remove-comments',
    name: '移除单行注释',
    pattern: '//.*',
    replace: '',
    description: '移除代码中的单行注释'
  },
  {
    id: 'format-date',
    name: '格式化日期',
    pattern: '(\\d{4})-(\\d{2})-(\\d{2})',
    replace: '$2/$3/$1',
    description: '将YYYY-MM-DD格式化为MM/DD/YYYY'
  },
  {
    id: 'reverse-words',
    name: '反转单词顺序',
    pattern: '(\\w+)\\s+',
    replace: '$1 ',
    description: '反转单词顺序（需要配合其他工具）'
  },
  {
    id: 'uppercase',
    name: '转大写',
    pattern: '[a-z]',
    replace: '$&'.toUpperCase(),
    description: '将字母转为大写'
  },
  {
    id: 'lowercase',
    name: '转小写',
    pattern: '[A-Z]',
    replace: '$&'.toLowerCase(),
    description: '将字母转为小写'
  },
  {
    id: 'remove-digits',
    name: '移除数字',
    pattern: '\\d',
    replace: '',
    description: '移除所有数字'
  },
  {
    id: 'remove-letters',
    name: '移除字母',
    pattern: '[a-zA-Z]',
    replace: '',
    description: '移除所有字母'
  },
  {
    id: 'extract-urls',
    name: '提取网址',
    pattern: '.*?(https?:\\/\\/[^\\s]+).*?',
    replace: '$1\\n',
    description: '从文本中提取所有网址'
  },
  {
    id: 'extract-phone',
    name: '提取手机号',
    pattern: '.*?(1[3-9]\\d{9}).*?',
    replace: '$1\\n',
    description: '从文本中提取所有手机号'
  },
  {
    id: 'format-currency',
    name: '格式化货币',
    pattern: '(\\d)(?=(\\d{3})+(?!\\d))',
    replace: '$1,',
    description: '为数字添加千分位分隔符'
  },
  {
    id: 'remove-brackets',
    name: '移除括号内容',
    pattern: '\\([^)]*\\)',
    replace: '',
    description: '移除圆括号及其内容'
  },
  {
    id: 'trim-spaces',
    name: '去除首尾空格',
    pattern: '^\\s+|\\s+$',
    replace: '',
    description: '去除每行首尾空格'
  },
  {
    id: 'replace-comma',
    name: '逗号转分号',
    pattern: ',',
    replace: ';',
    description: '将逗号替换为分号'
  },
  {
    id: 'extract-ips',
    name: '提取IP地址',
    pattern: '.*?((?:[0-9]{1,3}\\.){3}[0-9]{1,3}).*?',
    replace: '$1\\n',
    description: '从文本中提取所有IP地址'
  },
  {
    id: 'remove-special-chars',
    name: '移除特殊字符',
    pattern: '[^a-zA-Z0-9\\s]',
    replace: '',
    description: '移除所有特殊字符，只保留字母数字和空格'
  },
  {
    id: 'add-brackets',
    name: '添加括号',
    pattern: '^(.+)$',
    replace: '($1)',
    description: '为每行添加圆括号'
  },
  {
    id: 'remove-empty-lines',
    name: '移除空行',
    pattern: '^\\s*\\r?\\n',
    replace: '',
    description: '移除所有空行'
  },
  {
    id: 'extract-numbers',
    name: '提取数字',
    pattern: '.*?(-?\\d+(?:\\.\\d+)?).*?',
    replace: '$1\\n',
    description: '从文本中提取所有数字'
  },
  {
    id: 'format-json',
    name: '格式化JSON',
    pattern: ',',
    replace: ',\\n',
    description: '在逗号后添加换行（简化版JSON格式化）'
  },
  {
    id: 'remove-duplicate-words',
    name: '移除重复单词',
    pattern: '\\b(\\w+)\\s+\\1\\b',
    replace: '$1',
    description: '移除相邻的重复单词'
  }
]

// 监听输入变化，实时替换
watch([regex, replaceWith, testText, flags], () => {
  updateResult()
}, { deep: true })

// 更新替换结果
const updateResult = () => {
  resultText.value = ''
  matchCount.value = 0
  regexError.value = ''
  
  if (!regex.value || !testText.value) {
    return
  }
  
  try {
    // 构建正则表达式标志
    let flagsStr = ''
    if (flags.value.g) flagsStr += 'g'
    if (flags.value.i) flagsStr += 'i'
    if (flags.value.m) flagsStr += 'm'
    
    const regexObj = new RegExp(regex.value, flagsStr)
    
    // 计算匹配数量
    const matches = [...testText.value.matchAll(regexObj)]
    matchCount.value = matches.length
    
    // 执行替换
    resultText.value = testText.value.replace(regexObj, replaceWith.value)
  } catch (error) {
    regexError.value = `正则表达式错误: ${error.message}`
  }
}

// 应用模板
const applyTemplate = (template) => {
  regex.value = template.pattern
  replaceWith.value = template.replace
  alert('内容已添加到上方的输入框')
}

// 复制结果
const copyResult = () => {
  navigator.clipboard.writeText(resultText.value)
    .then(() => {
      alert('已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}

// 导出结果
const exportResult = () => {
  const blob = new Blob([resultText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'regex-replace-result.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 交换文本（将结果作为新的原始文本）
const swapText = () => {
  testText.value = resultText.value
  resultText.value = ''
  matchCount.value = 0
}
</script>

<style scoped>
.regex-page {
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: #2c3e50;
}

.tool-description {
  background-color: #f8f9fa;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border-left: 4px solid #1e88e5;
}

.input-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-group.full-width {
  width: 100%;
}

.input-group label {
  font-weight: 600;
  color: #333;
}

.regex-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.regex-input,
.replace-with-input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  width: 100%;
  transition: border-color 0.3s ease;
}

.regex-input:focus,
.replace-with-input:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.regex-flags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.regex-flags label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
  font-size: 0.9rem;
}

.test-text,
.result-text {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  width: 100%;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.test-text:focus,
.result-text:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.result-text {
  background-color: #f8f9fa;
}

.results-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.results-header h2 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}

.results-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1e88e5;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(30, 136, 229, 0.2);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(108, 117, 125, 0.2);
}

.btn-outline {
  background-color: transparent;
  color: #1e88e5;
  border: 1px solid #1e88e5;
}

.btn-outline:hover:not(:disabled) {
  background-color: #1e88e5;
  color: white;
  transform: translateY(-1px);
}

.match-stats {
  background-color: #e3f2fd;
  padding: 0.6rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #1565c0;
  font-size: 0.9rem;
}

.result-text-container {
  margin-bottom: 0.8rem;
}

.regex-error {
  padding: 0.8rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 6px;
  margin-top: 0.8rem;
  border-left: 4px solid #c62828;
  font-size: 0.9rem;
}

.no-matches {
  text-align: center;
  padding: 1.5rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
}

.templates-section {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.templates-section h2 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 0.6rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.8rem;
  margin: 0 auto;
  width: 100%;
}

.template-item {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-height: auto;
  white-space: normal;
}

.template-item:hover {
  background-color: #e3f2fd;
  border-color: #1e88e5;
  box-shadow: 0 3px 10px rgba(30, 136, 229, 0.15);
  transform: translateY(-2px);
}

.template-item h3 {
  font-size: 0.9rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
}

.template-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.template-info {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.template-info div {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
  align-items: center;
}

.template-info strong {
  font-weight: 600;
  color: #333;
  font-size: 0.75rem;
  min-width: auto;
  flex-shrink: 0;
}

.template-info code {
  display: block;
  background-color: #ffffff;
  padding: 0.3rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  border: 1px solid #e0e0e0;
  font-size: 0.75rem;
  margin-right: 0;
  overflow-x: auto;
  min-width: 0;
  flex: 1;
  text-align: center;
  word-break: break-all;
  width: 100%;
  max-width: 100%;
}

.template-item p {
  display: none;
}

/* 确保每个template-item内容清晰易读 */
.template-item {
  white-space: normal;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.6rem;
  }
  
  .template-item {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .template-item h3 {
    font-size: 0.8rem;
  }
  
  .template-info {
    font-size: 0.75rem;
  }
  
  .template-info code {
    font-size: 0.7rem;
    padding: 0.25rem;
  }
  
  .template-info strong {
    font-size: 0.7rem;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .regex-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .input-section,
  .results-section,
  .templates-section {
    padding: 1rem;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .results-actions {
    width: 100%;
    gap: 0.5rem;
  }
  
  .btn {
    flex: 1;
    padding: 0.75rem;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .regex-flags {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .regex-input,
  .replace-with-input,
  .test-text,
  .result-text {
    font-size: 0.85rem;
  }
  
  .template-item {
    padding: 0.8rem;
  }
}
</style>