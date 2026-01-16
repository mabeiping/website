<template>
  <div class="password-generator-page">
    <h1 class="page-title">密码生成器</h1>
    
    <div class="password-generator-container">
      <!-- 密码生成设置 -->
      <div class="generator-settings">
        <h2>密码设置</h2>
        
        <!-- 密码长度 -->
        <div class="setting-item">
          <div class="setting-header">
            <label for="passwordLength">密码长度：</label>
            <span class="setting-value">{{ passwordLength }}</span>
          </div>
          <input 
            type="range" 
            id="passwordLength" 
            v-model="passwordLength"
            @input="generatePassword"
            min="8" 
            max="50" 
            step="1"
          >
        </div>
        
        <!-- 字符类型 -->
        <div class="setting-item">
          <label>字符类型：</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="includeLowercase"
                @change="generatePassword"
              >
              <span>小写字母 (a-z)</span>
            </label>
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="includeUppercase"
                @change="generatePassword"
              >
              <span>大写字母 (A-Z)</span>
            </label>
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="includeNumbers"
                @change="generatePassword"
              >
              <span>数字 (0-9)</span>
            </label>
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="includeSymbols"
                @change="generatePassword"
              >
              <span>特殊字符 (!@#$%)</span>
            </label>
          </div>
        </div>
        
        <!-- 高级选项 -->
        <div class="setting-item advanced-options">
          <label>高级选项：</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="excludeSimilarChars"
                @change="generatePassword"
              >
              <span>排除相似字符 (0, O, l, I)</span>
            </label>
            <label class="checkbox-item">
              <input 
                type="checkbox" 
                v-model="requireAllTypes"
                @change="generatePassword"
              >
              <span>至少包含每种选中类型的一个字符</span>
            </label>
          </div>
        </div>
        
        <!-- 生成按钮 -->
        <div class="action-buttons">
          <button class="generate-btn" @click="generatePassword">生成密码</button>
          <button class="regenerate-btn" @click="generatePassword">重新生成</button>
        </div>
      </div>
      
      <!-- 密码结果 -->
      <div class="password-result">
        <h2>生成的密码</h2>
        
        <!-- 密码显示区域 -->
        <div class="password-display">
          <input 
            type="text" 
            v-model="generatedPassword"
            readonly
            class="password-input"
          >
          <div class="password-actions">
            <button class="action-btn" @click="togglePasswordVisibility">
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
            <button class="action-btn" @click="copyPassword" :disabled="!generatedPassword">
              复制
            </button>
            <button class="action-btn" @click="addToList" :disabled="!generatedPassword">
              添加到列表
            </button>
          </div>
        </div>
        
        <!-- 密码强度 -->
        <div class="password-strength" v-if="generatedPassword">
          <div class="strength-label">密码强度：</div>
          <div class="strength-bar">
            <div 
              class="strength-fill" 
              :class="passwordStrengthClass"
              :style="{ width: passwordStrength + '%' }"
            ></div>
          </div>
          <div class="strength-text">{{ passwordStrengthText }}</div>
        </div>
        
        <!-- 密码历史记录 -->
        <div class="password-history" v-if="passwordHistory.length > 0">
          <h3>密码历史记录</h3>
          <div class="history-list">
            <div 
              v-for="(password, index) in passwordHistory" 
              :key="index"
              class="history-item"
            >
              <input 
                type="text" 
                :value="showPassword ? password : '••••••'"
                readonly
                class="history-password"
              >
              <button class="history-action" @click="copyPasswordFromHistory(password)">复制</button>
              <button class="history-action delete" @click="removePasswordFromHistory(index)">删除</button>
            </div>
          </div>
          <button class="clear-history-btn" @click="clearHistory">清空历史记录</button>
        </div>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="password-generator-info">
      <h2>功能说明</h2>
      <p>密码生成器可用于生成高强度、随机的密码，提高账户安全性。</p>
      <ul>
        <li>支持自定义密码长度（8-50个字符）</li>
        <li>可选择包含小写字母、大写字母、数字和特殊字符</li>
        <li>支持排除相似字符，避免混淆</li>
        <li>可要求至少包含每种选中类型的一个字符</li>
        <li>实时显示密码强度评级</li>
        <li>支持显示/隐藏密码</li>
        <li>可复制密码到剪贴板</li>
        <li>支持保存密码历史记录</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 生成器设置
const passwordLength = ref(16)
const includeLowercase = ref(true)
const includeUppercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const excludeSimilarChars = ref(false)
const requireAllTypes = ref(true)

// 密码状态
const generatedPassword = ref('')
const showPassword = ref(false)
const passwordHistory = ref([])

// 字符集定义
const charSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~'
}

// 相似字符
const similarChars = '0OlI1'

// 生成密码
const generatePassword = () => {
  // 检查至少选择了一种字符类型
  if (!includeLowercase.value && !includeUppercase.value && !includeNumbers.value && !includeSymbols.value) {
    alert('请至少选择一种字符类型')
    return
  }
  
  // 构建字符集
  let charSet = ''
  if (includeLowercase.value) charSet += charSets.lowercase
  if (includeUppercase.value) charSet += charSets.uppercase
  if (includeNumbers.value) charSet += charSets.numbers
  if (includeSymbols.value) charSet += charSets.symbols
  
  // 排除相似字符
  if (excludeSimilarChars.value) {
    charSet = charSet.split('').filter(char => !similarChars.includes(char)).join('')
  }
  
  let password = ''
  let attempts = 0
  const maxAttempts = 100
  
  // 生成密码
  while (attempts < maxAttempts) {
    password = ''
    for (let i = 0; i < passwordLength.value; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length)
      password += charSet.charAt(randomIndex)
    }
    
    // 检查是否需要包含所有类型
    if (requireAllTypes.value) {
      let valid = true
      if (includeLowercase.value && !/[a-z]/.test(password)) valid = false
      if (includeUppercase.value && !/[A-Z]/.test(password)) valid = false
      if (includeNumbers.value && !/[0-9]/.test(password)) valid = false
      if (includeSymbols.value && !/[^a-zA-Z0-9]/.test(password)) valid = false
      
      if (valid) break
    } else {
      break
    }
    
    attempts++
  }
  
  generatedPassword.value = password
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 复制密码
const copyPassword = () => {
  if (!generatedPassword.value) return
  
  navigator.clipboard.writeText(generatedPassword.value)
    .then(() => {
      alert('密码已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

// 复制历史记录中的密码
const copyPasswordFromHistory = (password) => {
  navigator.clipboard.writeText(password)
    .then(() => {
      alert('密码已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

// 添加到列表
const addToList = () => {
  if (!generatedPassword.value) return
  
  passwordHistory.value.unshift(generatedPassword.value)
  // 只保留最近10个密码
  if (passwordHistory.value.length > 10) {
    passwordHistory.value = passwordHistory.value.slice(0, 10)
  }
}

// 从列表中移除
const removePasswordFromHistory = (index) => {
  passwordHistory.value.splice(index, 1)
}

// 清空历史记录
const clearHistory = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    passwordHistory.value = []
  }
}

// 计算密码强度
const passwordStrength = computed(() => {
  if (!generatedPassword.value) return 0
  
  const password = generatedPassword.value
  let strength = 0
  
  // 长度评分
  if (password.length >= 12) strength += 30
  else if (password.length >= 8) strength += 20
  else strength += 10
  
  // 字符类型评分
  if (/[a-z]/.test(password)) strength += 15
  if (/[A-Z]/.test(password)) strength += 15
  if (/[0-9]/.test(password)) strength += 15
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15
  
  // 复杂度评分
  if (password.length >= 16 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
    strength += 10
  }
  
  return Math.min(strength, 100)
})

// 密码强度文本
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return '弱'
  if (strength < 60) return '中'
  if (strength < 80) return '强'
  return '非常强'
})

// 密码强度类
const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'weak'
  if (strength < 60) return 'medium'
  if (strength < 80) return 'strong'
  return 'very-strong'
})

// 初始化生成密码
generatePassword()
</script>

<style scoped>
.password-generator-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.password-generator-container {
  display: flex;
  gap: 2rem;
}

.generator-settings {
  flex: 1;
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.generator-settings h2 {
  margin: 0 0 1.5rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.setting-header label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.setting-value {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.setting-item input[type="range"] {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: var(--color-border);
  outline: none;
}

.setting-item input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.setting-item label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-item input {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.checkbox-item span {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.advanced-options {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.generate-btn,
.regenerate-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn {
  background-color: var(--color-primary);
  color: white;
}

.generate-btn:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.regenerate-btn {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.regenerate-btn:hover {
  background-color: var(--color-bg-quaternary);
}

.password-result {
  flex: 1;
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.password-result h2 {
  margin: 0 0 1.5rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.password-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.password-input {
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-family: 'Consolas', 'Monaco', monospace;
  text-align: center;
  letter-spacing: 2px;
}

.password-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-strength {
  margin-bottom: 1.5rem;
}

.strength-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background-color: var(--color-danger);
}

.strength-fill.medium {
  background-color: #F59E0B;
}

.strength-fill.strong {
  background-color: #10B981;
}

.strength-fill.very-strong {
  background-color: #3B82F6;
}

.strength-text {
  text-align: center;
  font-weight: 700;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.strength-text.weak {
  color: var(--color-danger);
}

.strength-text.medium {
  color: #F59E0B;
}

.strength-text.strong {
  color: #10B981;
}

.strength-text.very-strong {
  color: #3B82F6;
}

.password-history {
  margin-top: 1.5rem;
}

.password-history h3 {
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.history-password {
  flex: 1;
  padding: 0.5rem;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  text-align: center;
  letter-spacing: 2px;
}

.history-action {
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-action:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.history-action.delete {
  background-color: var(--color-danger);
  color: white;
}

.history-action.delete:hover {
  background-color: var(--color-danger-hover);
}

.clear-history-btn {
  width: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.password-generator-info {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.password-generator-info h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.password-generator-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.password-generator-info ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.password-generator-info ul li {
  margin-bottom: 0.5rem;
}
</style>
