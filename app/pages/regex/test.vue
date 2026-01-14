<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <div class="regex-page">
    <h1 class="page-title">正则表达式测试工具</h1>
    
    <!-- 工具说明 -->
    <div class="tool-description">
      <p>测试正则表达式匹配效果，支持实时高亮显示匹配内容。</p>
    </div>
    
    <!-- 正则表达式输入区域 -->
    <div class="input-section">
      <div class="input-row">
        <div class="input-group">
          <label for="regex-input">正则表达式</label>
          <div class="regex-input-container">
            <input 
              type="text" 
              id="regex-input" 
              v-model="regex" 
              placeholder="输入正则表达式，如：\d{3}-\d{3}-\d{4}"
              class="regex-input"
            >
            <div class="regex-flags">
              <label><input type="checkbox" v-model="flags.g" id="global-flag"> g (全局匹配)</label>
              <label><input type="checkbox" v-model="flags.i" id="ignorecase-flag"> i (忽略大小写)</label>
              <label><input type="checkbox" v-model="flags.m" id="multiline-flag"> m (多行模式)</label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="input-row">
        <div class="input-group full-width">
          <label for="test-text">测试文本</label>
          <textarea 
            id="test-text" 
            v-model="testText" 
            placeholder="输入要匹配的文本内容..."
            class="test-text"
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
    
    <!-- 匹配结果区域 -->
    <div class="results-section">
      <div class="results-header">
        <h2>匹配结果</h2>
        <div class="results-actions">
          <button @click="copyResults" :disabled="!matches.length" class="btn btn-primary">
            复制高亮文本
          </button>
        </div>
      </div>
      
      <!-- 匹配统计 -->
      <div class="match-stats" v-if="matches.length > 0">
        <p>找到 <strong>{{ matches.length }}</strong> 个匹配项</p>
      </div>
      
      <!-- 高亮显示结果 -->
      <div class="highlighted-result" v-if="testText">
        <pre v-html="highlightedText"></pre>
      </div>
      
      <!-- 无匹配结果提示 -->
      <div class="no-matches" v-else-if="regex && testText">
        <p>没有找到匹配的内容</p>
      </div>
      
      <!-- 正则表达式错误提示 -->
      <div class="regex-error" v-if="regexError">
        <p>{{ regexError }}</p>
      </div>
    </div>
    
    <!-- 常用正则表达式模板 -->
    <div class="templates-section">
      <h2>常用正则表达式模板</h2>
      <div class="templates-grid">
        <div 
            v-for="template in templates" 
            :key="template.id" 
            class="template-item"
            @click="applyTemplate(template)"
          >
            <h3>{{ template.name }}</h3>
            <div>
              <code>{{ template.pattern }}</code>
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
const testText = ref('')
const flags = ref({
  g: true,
  i: false,
  m: false
})
const matches = ref([])
const regexError = ref('')

// 常用正则表达式模板
const templates = [
  {
    id: 'phone',
    name: '手机号码',
    pattern: '1[3-9]\\d{9}',
    description: '匹配中国大陆手机号码'
  },
  {
    id: 'email',
    name: '电子邮箱',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: '匹配电子邮箱地址'
  },
  {
    id: 'url',
    name: '网址URL',
    pattern: 'https?:\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\.,@?^=%&:/~\\+#]*[\\w\\-\@?^=%&/~\\+#])?',
    description: '匹配HTTP/HTTPS网址'
  },
  {
    id: 'date',
    name: '日期格式',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    description: '匹配YYYY-MM-DD日期格式'
  },
  {
    id: 'time',
    name: '时间格式',
    pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?',
    description: '匹配HH:MM或HH:MM:SS时间格式'
  },
  {
    id: 'ip',
    name: 'IP地址',
    pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    description: '匹配IPv4地址'
  },
  {
    id: 'idcard',
    name: '身份证号',
    pattern: '[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]',
    description: '匹配18位身份证号码'
  },
  {
    id: 'number',
    name: '数字(整数/小数)',
    pattern: '-?\\d+(\\.\\d+)?',
    description: '匹配整数或小数'
  },
  {
    id: 'zipcode',
    name: '邮政编码',
    pattern: '\\d{6}',
    description: '匹配6位邮政编码'
  },
  {
    id: 'qq',
    name: 'QQ号',
    pattern: '[1-9][0-9]{4,10}',
    description: '匹配5-11位QQ号'
  },
  {
    id: 'wechat',
    name: '微信号',
    pattern: '[a-zA-Z][-_a-zA-Z0-9]{5,19}',
    description: '匹配微信号（字母开头，6-20位）'
  },
  {
    id: 'chinese',
    name: '中文字符',
    pattern: '[\\u4e00-\\u9fa5]+',
    description: '匹配中文字符'
  },
  {
    id: 'chinese-name',
    name: '中文姓名',
    pattern: '[\\u4e00-\\u9fa5]{2,4}',
    description: '匹配中文姓名（2-4个汉字）'
  },
  {
    id: 'english-word',
    name: '英文单词',
    pattern: '\\b[a-zA-Z]+\\b',
    description: '匹配英文单词'
  },
  {
    id: 'hex-color',
    name: '十六进制颜色',
    pattern: '#[0-9a-fA-F]{3,6}',
    description: '匹配十六进制颜色代码'
  },
  {
    id: 'mac-address',
    name: 'MAC地址',
    pattern: '([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})',
    description: '匹配MAC地址'
  },
  {
    id: 'port',
    name: '端口号',
    pattern: '([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])',
    description: '匹配有效端口号（1-65535）'
  },
  {
    id: 'username',
    name: '用户名',
    pattern: '[a-zA-Z0-9_]{3,16}',
    description: '匹配用户名（3-16位字母数字下划线）'
  },
  {
    id: 'password',
    name: '密码强度',
    pattern: '(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}',
    description: '匹配至少8位包含字母和数字的密码'
  },
  {
    id: 'bank-card',
    name: '银行卡号',
    pattern: '\\d{16,19}',
    description: '匹配16-19位银行卡号'
  },
  {
    id: 'license-plate',
    name: '车牌号',
    pattern: '[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}',
    description: '匹配中国大陆车牌号'
  },
  {
    id: 'uuid',
    name: 'UUID',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
    description: '匹配UUID格式'
  },
  {
    id: 'file-extension',
    name: '文件扩展名',
    pattern: '\\.[a-zA-Z0-9]{2,4}$',
    description: '匹配文件扩展名'
  },
  {
    id: 'version',
    name: '版本号',
    pattern: '\\d+\\.\\d+\\.\\d+',
    description: '匹配版本号格式（如1.0.0）'
  },
  {
    id: 'percentage',
    name: '百分比',
    pattern: '\\d+(\\.\\d+)?%',
    description: '匹配百分比格式'
  },
  {
    id: 'file-path',
    name: '文件路径',
    pattern: '^[a-zA-Z]:\\\\(?:[^\\\\/:*?"<>|]+\\\\)*[^\\\\/:*?"<>|]*$',
    description: '匹配Windows文件路径'
  },
  {
    id: 'ipv6',
    name: 'IPv6地址',
    pattern: '(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})',
    description: '匹配IPv6地址'
  },
  {
    id: 'domain',
    name: '域名',
    pattern: '([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}',
    description: '匹配域名'
  },
  {
    id: 'money',
    name: '金额',
    pattern: '￥\\d{1,3}(,\\d{3})*(\\.\\d{2})?',
    description: '匹配人民币金额（带千分位）'
  }
]

// 监听正则表达式和测试文本变化，实时匹配
watch([regex, testText, flags], () => {
  updateMatches()
}, { deep: true })

// 更新匹配结果
const updateMatches = () => {
  matches.value = []
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
    let match
    
    // 查找所有匹配项
    while ((match = regexObj.exec(testText.value)) !== null) {
      matches.value.push(match)
      // 防止零宽断言导致的无限循环
      if (match.index === regexObj.lastIndex) {
        regexObj.lastIndex++
      }
    }
  } catch (error) {
    regexError.value = `正则表达式错误: ${error.message}`
  }
}

// 高亮显示匹配结果
const highlightedText = computed(() => {
  if (!testText.value || !regex.value || matches.value.length === 0) {
    return testText.value
  }
  
  try {
    // 构建正则表达式标志
    let flagsStr = ''
    if (flags.value.i) flagsStr += 'i'
    if (flags.value.m) flagsStr += 'm'
    
    const regexObj = new RegExp(regex.value, flagsStr)
    
    // 对文本进行高亮处理
    return testText.value.replace(regexObj, '<mark class="highlight">$&</mark>')
  } catch (error) {
    return testText.value
  }
})

// 应用模板
const applyTemplate = (template) => {
  regex.value = template.pattern
  alert('内容已添加到上方的输入框')
}

// 复制高亮文本
const copyResults = () => {
  // 创建临时元素获取纯文本
  const temp = document.createElement('div')
  temp.innerHTML = highlightedText.value
  const plainText = temp.textContent || temp.innerText || ''
  
  navigator.clipboard.writeText(plainText)
    .then(() => {
      alert('已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
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

.regex-input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  width: 100%;
  transition: border-color 0.3s ease;
}

.regex-input:focus {
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

.test-text {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  width: 100%;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.test-text:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
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
}

.results-header h2 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0;
}

.results-actions {
  display: flex;
  gap: 0.8rem;
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

.highlighted-result {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  max-height: 350px;
  overflow-y: auto;
}

.highlighted-result pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.highlight {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.15rem 0.3rem;
  border-radius: 3px;
  font-weight: 600;
  font-size: 0.85rem;
}

.no-matches {
  text-align: center;
  padding: 1.5rem;
  color: #666;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

.template-item code {
  display: block;
  background-color: #ffffff;
  padding: 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  border: 1px solid #e0e0e0;
  overflow-x: auto;
  text-align: center;
  word-break: break-all;
}

.template-item p {
  display: none;
}

/* 卡片布局 */
.template-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.6rem;
  }
  
  .template-item {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .template-item h3 {
    font-size: 0.8rem;
  }
  
  .template-item code {
    font-size: 0.7rem;
    padding: 0.3rem;
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
    gap: 1rem;
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
  .test-text {
    font-size: 0.85rem;
  }
  
  .template-item {
    padding: 0.8rem;
  }
  
  .highlighted-result {
    padding: 1rem;
  }
}
</style>