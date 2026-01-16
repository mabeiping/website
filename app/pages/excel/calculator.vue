<template>
  <div class="calculator-page">
    <div class="calculator-container">
      <!-- 计算器模式切换 -->
      <div class="mode-switcher">
        <button 
          class="mode-button" 
          :class="{ active: calculatorMode === 'basic' }" 
          @click="calculatorMode = 'basic'"
        >
          基础计算器
        </button>
        <button 
          class="mode-button" 
          :class="{ active: calculatorMode === 'scientific' }" 
          @click="calculatorMode = 'scientific'"
        >
          科学计算器
        </button>
      </div>
      
      <!-- 计算器显示区域 -->
      <div class="calculator-display">
        <div class="display-expression">{{ displayExpression }}</div>
        <div class="display-current">{{ displayCurrent || '0' }}</div>
        <div class="display-memory" v-if="memory !== null">
          M: {{ memory }}
        </div>
      </div>
      
      <!-- 基础计算器按键区域 -->
      <div v-if="calculatorMode === 'basic'" class="calculator-buttons basic-mode">
        <!-- 第一行：清除、删除、百分比、除法 -->
        <div class="button-row">
          <button class="calc-button btn-clear" @click="clearAll">AC</button>
          <button class="calc-button btn-delete" @click="deleteLast">⌫</button>
          <button class="calc-button btn-operator" @click="appendOperator('%')">%</button>
          <button class="calc-button btn-operator" @click="appendOperator('/')">÷</button>
        </div>
        
        <!-- 第二行：7、8、9、乘法 -->
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('7')">7</button>
          <button class="calc-button btn-number" @click="appendNumber('8')">8</button>
          <button class="calc-button btn-number" @click="appendNumber('9')">9</button>
          <button class="calc-button btn-operator" @click="appendOperator('*')">×</button>
        </div>
        
        <!-- 第三行：4、5、6、减法 -->
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('4')">4</button>
          <button class="calc-button btn-number" @click="appendNumber('5')">5</button>
          <button class="calc-button btn-number" @click="appendNumber('6')">6</button>
          <button class="calc-button btn-operator" @click="appendOperator('-')">−</button>
        </div>
        
        <!-- 第四行：1、2、3、加法 -->
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('1')">1</button>
          <button class="calc-button btn-number" @click="appendNumber('2')">2</button>
          <button class="calc-button btn-number" @click="appendNumber('3')">3</button>
          <button class="calc-button btn-operator" @click="appendOperator('+')">+</button>
        </div>
        
        <!-- 第五行：0、小数点、正负号、等号 -->
        <div class="button-row">
          <button class="calc-button btn-number btn-zero" @click="appendNumber('0')">0</button>
          <button class="calc-button btn-number" @click="appendDecimal()">.</button>
          <button class="calc-button btn-operator" @click="toggleSign()">±</button>
          <button class="calc-button btn-equals" @click="calculate">=</button>
        </div>
      </div>
      
      <!-- 科学计算器按键区域 -->
      <div v-else class="calculator-buttons scientific-mode">
        <!-- 科学函数行 -->
        <div class="button-row scientific-row">
          <button class="calc-button btn-scientific" @click="appendFunction('sin')">sin</button>
          <button class="calc-button btn-scientific" @click="appendFunction('cos')">cos</button>
          <button class="calc-button btn-scientific" @click="appendFunction('tan')">tan</button>
          <button class="calc-button btn-scientific" @click="appendFunction('log')">log</button>
          <button class="calc-button btn-scientific" @click="appendFunction('ln')">ln</button>
        </div>
        
        <!-- 科学函数行2 -->
        <div class="button-row scientific-row">
          <button class="calc-button btn-scientific" @click="appendFunction('sqrt')">√</button>
          <button class="calc-button btn-scientific" @click="appendFunction('pow')">x²</button>
          <button class="calc-button btn-scientific" @click="appendFunction('pow3')">x³</button>
          <button class="calc-button btn-scientific" @click="appendFunction('inv')">1/x</button>
          <button class="calc-button btn-scientific" @click="appendFunction('fact')">n!</button>
        </div>
        
        <!-- 常数行 -->
        <div class="button-row scientific-row">
          <button class="calc-button btn-scientific" @click="appendConstant('PI')">π</button>
          <button class="calc-button btn-scientific" @click="appendConstant('E')">e</button>
          <button class="calc-button btn-scientific" @click="appendOperator('^')">xʸ</button>
          <button class="calc-button btn-scientific" @click="appendFunction('abs')">|x|</button>
          <button class="calc-button btn-scientific" @click="appendOperator('(')">(</button>
        </div>
        
        <!-- 基础数字行 -->
        <div class="button-row">
          <button class="calc-button btn-scientific" @click="appendOperator(')')">)</button>
          <button class="calc-button btn-clear" @click="clearAll">AC</button>
          <button class="calc-button btn-delete" @click="deleteLast">⌫</button>
          <button class="calc-button btn-operator" @click="appendOperator('/')">÷</button>
        </div>
        
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('7')">7</button>
          <button class="calc-button btn-number" @click="appendNumber('8')">8</button>
          <button class="calc-button btn-number" @click="appendNumber('9')">9</button>
          <button class="calc-button btn-operator" @click="appendOperator('*')">×</button>
        </div>
        
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('4')">4</button>
          <button class="calc-button btn-number" @click="appendNumber('5')">5</button>
          <button class="calc-button btn-number" @click="appendNumber('6')">6</button>
          <button class="calc-button btn-operator" @click="appendOperator('-')">−</button>
        </div>
        
        <div class="button-row">
          <button class="calc-button btn-number" @click="appendNumber('1')">1</button>
          <button class="calc-button btn-number" @click="appendNumber('2')">2</button>
          <button class="calc-button btn-number" @click="appendNumber('3')">3</button>
          <button class="calc-button btn-operator" @click="appendOperator('+')">+</button>
        </div>
        
        <div class="button-row">
          <button class="calc-button btn-number btn-zero" @click="appendNumber('0')">0</button>
          <button class="calc-button btn-number" @click="appendDecimal()">.</button>
          <button class="calc-button btn-operator" @click="toggleSign()">±</button>
          <button class="calc-button btn-equals" @click="calculate">=</button>
        </div>
      </div>
      
      <!-- 历史记录 -->
      <div class="history-panel" v-if="showHistory">
        <div class="history-header">
          <h3>计算历史</h3>
          <button class="close-history" @click="showHistory = false">×</button>
        </div>
        <div class="history-list">
          <div 
            v-for="(item, index) in history" 
            :key="index" 
            class="history-item"
            @click="useHistoryItem(item)"
          >
            <div class="history-expression">{{ item.expression }}</div>
            <div class="history-result">= {{ item.result }}</div>
          </div>
        </div>
        <div class="history-actions">
          <button class="history-action-btn" @click="clearHistory">清空历史</button>
          <button class="history-action-btn" @click="exportHistory">导出历史</button>
        </div>
      </div>
      
      <!-- 功能按钮 -->
      <div class="function-buttons">
        <button class="function-btn" @click="showHistory = !showHistory">
          <span class="icon">📋</span> 历史记录
        </button>
        <button class="function-btn" @click="copyResult">
          <span class="icon">📄</span> 复制结果
        </button>
        <button class="function-btn memory-btn" @click="memoryStore">
          <span class="icon">💾</span> M+
        </button>
        <button class="function-btn memory-btn" @click="memoryRecall">
          <span class="icon">📥</span> MR
        </button>
        <button class="function-btn memory-btn" @click="memoryClear">
          <span class="icon">🗑️</span> MC
        </button>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="calculator-info">
      <h2>功能说明</h2>
      <div class="info-content">
        <div class="info-section">
          <h3>基础功能</h3>
          <ul>
            <li>支持加法(+)、减法(−)、乘法(×)、除法(÷)运算</li>
            <li>支持百分比(%)计算</li>
            <li>支持小数输入</li>
            <li>可清除当前输入或删除最后一位</li>
            <li>支持正负号切换</li>
          </ul>
        </div>
        <div class="info-section">
          <h3>科学功能</h3>
          <ul>
            <li>三角函数：sin、cos、tan</li>
            <li>对数函数：log、ln</li>
            <li>幂函数：x²、x³、xʸ</li>
            <li>其他函数：√、1/x、n!、|x|</li>
            <li>常数：π、e</li>
          </ul>
        </div>
        <div class="info-section">
          <h3>记忆功能</h3>
          <ul>
            <li>M+：将当前结果存入记忆</li>
            <li>MR：读取记忆中的值</li>
            <li>MC：清除记忆</li>
          </ul>
        </div>
        <div class="info-section">
          <h3>历史记录</h3>
          <ul>
            <li>自动保存最近20条计算记录</li>
            <li>点击历史记录可重新使用</li>
            <li>支持导出历史记录</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// 计算器状态管理
const calculatorMode = ref('basic')
const displayCurrent = ref('')
const displayExpression = ref('')
const memory = ref(null)
const showHistory = ref(false)
const history = ref([])

// 科学计算器状态
const scientificMode = ref(false)

// 添加数字
const appendNumber = (number) => {
  if (displayCurrent.value === '0' || displayCurrent.value === '') {
    displayCurrent.value = number
  } else {
    displayCurrent.value += number
  }
}

// 添加小数点
const appendDecimal = () => {
  if (!displayCurrent.value.includes('.')) {
    displayCurrent.value += '.'
  }
}

// 添加运算符
const appendOperator = (op) => {
  if (displayCurrent.value === '') return
  
  displayExpression.value += displayCurrent.value + ' ' + op + ' '
  displayCurrent.value = ''
}

// 添加函数
const appendFunction = (func) => {
  if (displayCurrent.value === '') return
  
  displayCurrent.value = func + '(' + displayCurrent.value + ')'
}

// 添加常数
const appendConstant = (constant) => {
  const value = constant === 'PI' ? Math.PI : Math.E
  if (displayCurrent.value === '') {
    displayCurrent.value = String(value)
  } else {
    displayCurrent.value += String(value)
  }
}

// 切换正负号
const toggleSign = () => {
  if (displayCurrent.value === '' || displayCurrent.value === '0') return
  
  if (displayCurrent.value.startsWith('-')) {
    displayCurrent.value = displayCurrent.value.slice(1)
  } else {
    displayCurrent.value = '-' + displayCurrent.value
  }
}

// 清除所有
const clearAll = () => {
  displayCurrent.value = ''
  displayExpression.value = ''
}

// 删除最后一位
const deleteLast = () => {
  displayCurrent.value = displayCurrent.value.slice(0, -1)
}

// 计算结果
const calculate = () => {
  if (displayCurrent.value === '' || displayExpression.value === '') return
  
  const fullExpression = displayExpression.value + displayCurrent.value
  let result
  
  try {
    if (calculatorMode.value === 'basic') {
      result = evaluateBasic(fullExpression)
    } else {
      result = evaluateScientific(fullExpression)
    }
    
    if (result !== undefined && !isNaN(result)) {
      // 保存到历史记录
      history.value.unshift({
        expression: fullExpression,
        result: result
      })
      
      // 限制历史记录数量
      if (history.value.length > 20) {
        history.value.pop()
      }
      
      displayCurrent.value = String(result)
      displayExpression.value = fullExpression + ' ='
    }
  } catch (error) {
    displayCurrent.value = 'Error'
  }
}

// 基础计算器求值
const evaluateBasic = (expression) => {
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/%/g, '/100*')
  
  return eval(sanitized)
}

// 科学计算器求值
const evaluateScientific = (expression) => {
  const sanitized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/%/g, '/100*')
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan')
    .replace(/log/g, 'Math.log10')
    .replace(/ln/g, 'Math.log')
    .replace(/√/g, 'Math.sqrt')
    .replace(/x²/g, 'Math.pow')
    .replace(/x³/g, 'Math.pow')
    .replace(/xʸ/g, 'Math.pow')
    .replace(/1\/x/g, '1/')
    .replace(/n!/g, 'factorial')
    .replace(/\|x\|/g, 'Math.abs')
    .replace(/π/g, 'Math.PI')
    .replace(/e/g, 'Math.E')
  
  return eval(sanitized)
}

// 阶乘函数
const factorial = (n) => {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}

// 记忆功能
const memoryStore = () => {
  if (displayCurrent.value !== '') {
    memory.value = parseFloat(displayCurrent.value)
  }
}

const memoryRecall = () => {
  if (memory.value !== null) {
    displayCurrent.value = String(memory.value)
  }
}

const memoryClear = () => {
  memory.value = null
}

// 历史记录功能
const useHistoryItem = (item) => {
  displayCurrent.value = String(item.result)
  displayExpression.value = item.expression
  showHistory.value = false
}

const clearHistory = () => {
  history.value = []
}

const exportHistory = () => {
  const text = history.value.map(item => `${item.expression} = ${item.result}`).join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `calculator-history-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 复制结果
const copyResult = () => {
  if (displayCurrent.value !== '') {
    navigator.clipboard.writeText(displayCurrent.value)
  }
}

// 监听历史记录变化，保存到本地存储
watch(history, (newHistory) => {
  localStorage.setItem('calculatorHistory', JSON.stringify(newHistory))
}, { deep: true })

// 从本地存储加载历史记录
if (typeof window !== 'undefined') {
  const savedHistory = localStorage.getItem('calculatorHistory')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
}
</script>

<style scoped>
.calculator-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
}

/* 计算器容器 */
.calculator-container {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  position: relative;
}

/* 模式切换器 */
.mode-switcher {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.mode-button {
  flex: 1;
  padding: 0.5rem 1rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.mode-button:hover {
  background: var(--color-bg-tertiary);
}

.mode-button.active:hover {
  background: var(--color-primary-hover);
}

/* 显示区域 */
.calculator-display {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: right;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.display-expression {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  margin-bottom: 0.25rem;
  min-height: 1rem;
}

.display-current {
  color: var(--color-text-primary);
  font-size: 1.75rem;
  font-weight: 600;
  font-family: 'Courier New', monospace;
  overflow-x: auto;
  white-space: nowrap;
}

.display-memory {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  margin-top: 0.25rem;
}

/* 按键区域 */
.calculator-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.button-row {
  display: flex;
  gap: 0.25rem;
}

.scientific-row {
  justify-content: space-between;
}

/* 按钮样式 */
.calc-button {
  flex: 1;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.calc-button:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-secondary);
}

.calc-button:active {
  transform: scale(0.98);
}

/* 按钮类型 */
.btn-number {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.btn-operator {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-scientific {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.btn-clear {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

.btn-delete {
  background: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}

.btn-equals {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-size: 1.25rem;
}

.btn-zero {
  flex: 2;
}

/* 功能按钮 */
.function-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.function-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.function-btn:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.function-btn .icon {
  font-size: 1rem;
}

.memory-btn {
  min-width: 70px;
}

/* 历史记录面板 */
.history-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  max-height: 350px;
  display: flex;
  flex-direction: column;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.history-header h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.close-history {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.close-history:hover {
  background: var(--color-bg-tertiary);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0.75rem;
}

.history-item {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid var(--color-border);
}

.history-item:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary);
}

.history-expression {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.125rem;
}

.history-result {
  font-size: 0.9375rem;
  color: var(--color-primary);
  font-weight: 600;
}

.history-actions {
  display: flex;
  gap: 0.75rem;
}

.history-action-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-action-btn:hover {
  background: var(--color-primary-hover);
}

/* 功能说明区域 */
.calculator-info {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
  box-shadow: var(--shadow-sm);
}

.calculator-info h2 {
  font-size: 1.125rem;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
  text-align: center;
}

.info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-section {
  background-color: var(--color-bg-secondary);
  border-radius: 4px;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
}

.info-section h3 {
  font-size: 0.9375rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  padding-bottom: 0.375rem;
  border-bottom: 1px solid var(--color-border);
}

.info-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-section li {
  padding: 0.25rem 0;
  padding-left: 1.25rem;
  position: relative;
  color: var(--color-text-secondary);
  line-height: 1.5;
  font-size: 0.8125rem;
}

.info-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calculator-page {
    padding: 1rem;
  }
  
  .calculator-container {
    padding: 1.5rem;
  }
  
  .display-current {
    font-size: 2rem;
  }
  
  .calc-button {
    padding: 1rem;
    font-size: 1.1rem;
    min-height: 50px;
  }
  
  .btn-scientific {
    font-size: 0.95rem;
  }
  
  .function-buttons {
    flex-direction: column;
  }
  
  .function-btn {
    width: 100%;
    justify-content: center;
  }
  
  .info-content {
    grid-template-columns: 1fr;
  }
  
  .history-panel {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .display-current {
    font-size: 1.75rem;
  }
  
  .calc-button {
    padding: 0.875rem;
    font-size: 1rem;
    min-height: 45px;
  }
  
  .btn-scientific {
    font-size: 0.85rem;
  }
}
</style>