<template>
  <div class="page-container">
    <!-- 主内容区域 -->
    <div class="regex-page">
    <h1 class="page-title">正则表达式生成工具</h1>
    
    <!-- 工具说明 -->
    <div class="tool-description">
      <p>通过选择常见模式自动生成正则表达式，无需手动编写复杂的正则语法。</p>
    </div>
    
    <!-- 生成选项区域 -->
    <div class="generator-section">
      <div class="input-row">
        <div class="input-group full-width">
          <label>选择要生成的正则表达式类型</label>
          <div class="pattern-types">
            <div 
              v-for="type in patternTypes" 
              :key="type.id" 
              class="pattern-type-item"
              :class="{ active: selectedType === type.id }"
              @click="selectType(type.id)"
            >
              {{ type.name }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 特定类型的选项 -->
      <div class="options-section" v-if="selectedType">
        <h2>配置选项</h2>
        
        <!-- 电话号码选项 -->
        <div v-if="selectedType === 'phone'" class="option-group">
          <h3>电话号码</h3>
          <div class="option-item">
            <label><input type="checkbox" v-model="phoneOptions.includeCountryCode"> 包含国家代码</label>
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="phoneOptions.includeAreaCode"> 包含区号</label>
          </div>
        </div>
        
        <!-- 电子邮箱选项 -->
        <div v-if="selectedType === 'email'" class="option-group">
          <h3>电子邮箱</h3>
          <div class="option-item">
            <label><input type="checkbox" v-model="emailOptions.allowPlusTag"> 允许 + 标签（如 user+tag@example.com）</label>
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="emailOptions.allowIpDomain"> 允许 IP 地址域名</label>
          </div>
        </div>
        
        <!-- 日期选项 -->
        <div v-if="selectedType === 'date'" class="option-group">
          <h3>日期格式</h3>
          <div class="option-item">
            <label>格式：</label>
            <select v-model="dateOptions.format">
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY.MM.DD">YYYY.MM.DD</option>
            </select>
          </div>
        </div>
        
        <!-- 密码强度选项 -->
        <div v-if="selectedType === 'password'" class="option-group">
          <h3>密码强度</h3>
          <div class="option-item">
            <label>最小长度：</label>
            <input type="number" v-model.number="passwordOptions.minLength" min="1" max="50">
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="passwordOptions.requireUppercase"> 包含大写字母</label>
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="passwordOptions.requireLowercase"> 包含小写字母</label>
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="passwordOptions.requireNumbers"> 包含数字</label>
          </div>
          <div class="option-item">
            <label><input type="checkbox" v-model="passwordOptions.requireSpecialChars"> 包含特殊字符</label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 生成结果区域 -->
    <div class="results-section" v-if="generatedRegex">
      <div class="results-header">
        <h2>生成的正则表达式</h2>
        <button @click="copyGeneratedRegex" class="btn btn-primary">
          复制正则表达式
        </button>
      </div>
      
      <div class="generated-regex">
        <code>{{ generatedRegex }}</code>
      </div>
      
      <div class="regex-info">
        <h3>说明</h3>
        <p>{{ generatedRegexDescription }}</p>
      </div>
      
      <!-- 测试区域 -->
      <div class="test-section">
        <h3>测试</h3>
        <textarea 
          v-model="testText" 
          placeholder="输入测试文本..."
          class="test-text"
          rows="3"
        ></textarea>
        <div class="test-result" v-if="testText">
          <div v-if="testMatches.length > 0" class="test-match-success">
            匹配成功！找到 {{ testMatches.length }} 个匹配项。
          </div>
          <div v-else class="test-match-fail">
            没有找到匹配项。
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

// 状态管理
const selectedType = ref('')
const testText = ref('')
const testMatches = ref([])

// 正则表达式类型列表
const patternTypes = [
  { id: 'phone', name: '电话号码' },
  { id: 'email', name: '电子邮箱' },
  { id: 'url', name: '网址URL' },
  { id: 'date', name: '日期格式' },
  { id: 'time', name: '时间格式' },
  { id: 'ip', name: 'IP地址' },
  { id: 'password', name: '密码强度' },
  { id: 'idcard', name: '身份证号' },
  { id: 'number', name: '数字' }
]

// 各类型的选项
const phoneOptions = ref({
  includeCountryCode: false,
  includeAreaCode: false
})

const emailOptions = ref({
  allowPlusTag: false,
  allowIpDomain: false
})

const dateOptions = ref({
  format: 'YYYY-MM-DD'
})

const passwordOptions = ref({
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
})

// 选择类型
const selectType = (typeId) => {
  selectedType.value = typeId
}

// 生成正则表达式
const generatedRegex = computed(() => {
  if (!selectedType.value) return ''
  
  switch (selectedType.value) {
    case 'phone':
      if (phoneOptions.value.includeCountryCode && phoneOptions.value.includeAreaCode) {
        return '\\+?\\d{1,4}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}'
      } else if (phoneOptions.value.includeAreaCode) {
        return '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}'
      } else if (phoneOptions.value.includeCountryCode) {
        return '\\+?\\d{1,4}[-.\\s]?\\d{3}[-.\\s]?\\d{4}'
      } else {
        return '\\d{11}' // 中国大陆手机号
      }
    
    case 'email':
      if (emailOptions.value.allowPlusTag && emailOptions.value.allowIpDomain) {
        return '[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9.-]+|\\[\\d.]+\\])\\.[a-zA-Z]{2,}'
      } else if (emailOptions.value.allowPlusTag) {
        return '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
      } else if (emailOptions.value.allowIpDomain) {
        return '[a-zA-Z0-9._%-]+@(?:[a-zA-Z0-9.-]+|\\[\\d.]+\\])\\.[a-zA-Z]{2,}'
      } else {
        return '[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
      }
    
    case 'url':
      return 'https?:\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?'
    
    case 'date':
      switch (dateOptions.value.format) {
        case 'YYYY-MM-DD':
          return '\\d{4}-\\d{2}-\\d{2}'
        case 'DD/MM/YYYY':
          return '\\d{2}/\\d{2}/\\d{4}'
        case 'MM/DD/YYYY':
          return '\\d{2}/\\d{2}/\\d{4}'
        case 'YYYY.MM.DD':
          return '\\d{4}\\.\\d{2}\\.\\d{2}'
        default:
          return '\\d{4}-\\d{2}-\\d{2}'
      }
    
    case 'time':
      return '([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?'
    
    case 'ip':
      return '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b'
    
    case 'password':
      let passwordPattern = '^'
      
      if (passwordOptions.value.requireUppercase) {
        passwordPattern += '(?=.*[A-Z])'
      }
      if (passwordOptions.value.requireLowercase) {
        passwordPattern += '(?=.*[a-z])'
      }
      if (passwordOptions.value.requireNumbers) {
        passwordPattern += '(?=.*\\d)'
      }
      if (passwordOptions.value.requireSpecialChars) {
        passwordPattern += '(?=.*[!@#$%^&*()_+\\[\\]{}|;:,.<>?])'
      }
      
      passwordPattern += '.{' + passwordOptions.value.minLength + ',}$'
      return passwordPattern
    
    case 'idcard':
      return '[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]'
    
    case 'number':
      return '-?\\d+(\\.\\d+)?'
    
    default:
      return ''
  }
})

// 生成的正则表达式说明
const generatedRegexDescription = computed(() => {
  if (!selectedType.value) return ''
  
  switch (selectedType.value) {
    case 'phone':
      return '匹配电话号码格式'
    case 'email':
      return '匹配电子邮箱地址'
    case 'url':
      return '匹配HTTP/HTTPS网址'
    case 'date':
      return `匹配${dateOptions.value.format}格式的日期`
    case 'time':
      return '匹配HH:MM或HH:MM:SS格式的时间'
    case 'ip':
      return '匹配IPv4地址'
    case 'password':
      return '匹配符合指定强度要求的密码'
    case 'idcard':
      return '匹配18位身份证号码'
    case 'number':
      return '匹配整数或小数'
    default:
      return ''
  }
})

// 测试生成的正则表达式
watch([generatedRegex, testText], () => {
  if (!generatedRegex.value || !testText.value) {
    testMatches.value = []
    return
  }
  
  try {
    const regex = new RegExp(generatedRegex.value, 'g')
    const matches = [...testText.value.matchAll(regex)]
    testMatches.value = matches
  } catch (error) {
    testMatches.value = []
  }
})

// 复制生成的正则表达式
const copyGeneratedRegex = () => {
  navigator.clipboard.writeText(generatedRegex.value)
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

.generator-section {
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

.pattern-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.8rem;
}

.pattern-type-item {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.6rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.pattern-type-item:hover {
  background-color: #e3f2fd;
  border-color: #1e88e5;
}

.pattern-type-item.active {
  background-color: #1e88e5;
  color: white;
  border-color: #1e88e5;
}

.options-section {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.8rem;
}

.options-section h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.options-section h3 {
  font-size: 1rem;
  margin-bottom: 0.8rem;
  color: #333;
}

.option-group {
  margin-bottom: 1rem;
}

.option-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.option-item label {
  font-weight: normal;
  cursor: pointer;
  font-size: 0.9rem;
}

.option-item input[type="number"],
.option-item select {
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
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

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #1e88e5;
  color: white;
}

.btn-primary:hover {
  background-color: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(30, 136, 229, 0.2);
}

.generated-regex {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  word-break: break-all;
}

.generated-regex code {
  background-color: transparent;
  padding: 0;
  font-size: inherit;
}

.regex-info {
  background-color: #e3f2fd;
  padding: 0.8rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.regex-info h3 {
  font-size: 1rem;
  margin-bottom: 0.4rem;
  color: #1565c0;
}

.regex-info p {
  margin: 0;
  color: #1565c0;
  font-size: 0.9rem;
}

.test-section {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
}

.test-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
}

.test-text {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  width: 100%;
  resize: vertical;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.test-text:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.1);
}

.test-result {
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
}

.test-match-success {
  background-color: #d4edda;
  color: #155724;
}

.test-match-fail {
  background-color: #f8d7da;
  color: #721c24;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .regex-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .generator-section,
  .results-section {
    padding: 1rem;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
  }
  
  .pattern-types {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .options-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .pattern-types {
    grid-template-columns: 1fr;
  }
  
  .option-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .generated-regex {
    font-size: 0.9rem;
    padding: 1rem;
  }
}
</style>