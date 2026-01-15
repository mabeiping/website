<template>
  <div class="calculator-page">
    <h1 class="page-title">在线计算器</h1>
    
    <div class="calculator-container">
      <!-- 计算器显示区域 -->
      <div class="calculator-display">
        <div class="display-history">{{ displayHistory }}</div>
        <div class="display-current">{{ displayCurrent || '0' }}</div>
      </div>
      
      <!-- 计算器按键区域 -->
      <div class="calculator-buttons">
        <!-- 第一行：清除、删除、百分比、除法 -->
        <div class="button-row">
          <button class="calc-button btn-clear" @click="clear">C</button>
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
        
        <!-- 第五行：0、小数点、等号 -->
        <div class="button-row">
          <button class="calc-button btn-number btn-zero" @click="appendNumber('0')">0</button>
          <button class="calc-button btn-number" @click="appendDecimal()">.</button>
          <button class="calc-button btn-equals" @click="calculate">=</button>
        </div>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="calculator-info">
      <h2>功能说明</h2>
      <p>这是一个功能齐全的在线计算器，支持基础运算和百分比计算。</p>
      <ul>
        <li>支持加法(+)、减法(−)、乘法(×)、除法(÷)运算</li>
        <li>支持百分比(%)计算</li>
        <li>支持小数输入</li>
        <li>可清除当前输入或删除最后一位</li>
        <li>实时显示计算历史</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 计算器状态管理
const displayCurrent = ref('')
const displayHistory = ref('')
const firstOperand = ref(null)
const operator = ref(null)
const waitingForSecondOperand = ref(false)

// 清除所有状态
const clear = () => {
  displayCurrent.value = ''
  displayHistory.value = ''
  firstOperand.value = null
  operator.value = null
  waitingForSecondOperand.value = false
}

// 删除最后一位
const deleteLast = () => {
  displayCurrent.value = displayCurrent.value.slice(0, -1)
}

// 添加数字
const appendNumber = (number) => {
  if (waitingForSecondOperand.value) {
    displayCurrent.value = number
    waitingForSecondOperand.value = false
  } else {
    displayCurrent.value = displayCurrent.value === '0' ? number : displayCurrent.value + number
  }
}

// 添加小数点
const appendDecimal = () => {
  if (waitingForSecondOperand.value) {
    displayCurrent.value = '0.'
    waitingForSecondOperand.value = false
  } else if (!displayCurrent.value.includes('.')) {
    displayCurrent.value += '.'
  }
}

// 添加运算符
const appendOperator = (nextOperator) => {
  const inputValue = parseFloat(displayCurrent.value)
  
  if (firstOperand.value === null) {
    firstOperand.value = inputValue
  } else if (operator.value) {
    const result = calculateResult()
    displayCurrent.value = String(result)
    firstOperand.value = result
  }
  
  waitingForSecondOperand.value = true
  operator.value = nextOperator
  displayHistory.value = `${firstOperand.value} ${operator.value}`
}

// 计算结果
const calculate = () => {
  if (operator.value && !waitingForSecondOperand.value) {
    const result = calculateResult()
    displayCurrent.value = String(result)
    displayHistory.value = `${firstOperand.value} ${operator.value} ${displayCurrent.value} =`
    firstOperand.value = null
    operator.value = null
  }
}

// 执行具体计算
const calculateResult = () => {
  const inputValue = parseFloat(displayCurrent.value)
  let result = 0
  
  switch (operator.value) {
    case '+':
      result = firstOperand.value + inputValue
      break
    case '-':
      result = firstOperand.value - inputValue
      break
    case '*':
      result = firstOperand.value * inputValue
      break
    case '/':
      result = inputValue === 0 ? 'Error' : firstOperand.value / inputValue
      break
    case '%':
      result = firstOperand.value * (inputValue / 100)
      break
    default:
      return inputValue
  }
  
  return result
}
</script>

<style scoped>
.calculator-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-family: '黑体', sans-serif;
}

.calculator-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid var(--color-border);
}

/* 显示区域 */
.calculator-display {
  background-color: var(--color-bg-tertiary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: right;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.display-history {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  min-height: 20px;
}

.display-current {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  overflow-x: auto;
  white-space: nowrap;
}

/* 按键区域 */
.calculator-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.button-row {
  display: flex;
  gap: 0.75rem;
}

/* 按键样式 */
.calc-button {
  flex: 1;
  padding: 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calc-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.calc-button:active {
  transform: translateY(0);
}

/* 按键类型样式 */
.btn-number {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-operator {
  background-color: var(--color-primary);
  color: white;
}

.btn-clear, .btn-delete {
  background-color: var(--color-accent);
  color: white;
}

.btn-equals {
  background-color: var(--color-secondary);
  color: white;
}

.btn-zero {
  flex: 2;
}

/* 功能说明区域 */
.calculator-info {
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.calculator-info h2 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-weight: 700;
}

.calculator-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.calculator-info ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
}

.calculator-info li {
  margin-bottom: 0.5rem;
  position: relative;
}

.calculator-info li::marker {
  color: var(--color-primary);
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .calculator-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
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
  
  .button-row,
  .calculator-buttons {
    gap: 0.5rem;
  }
  
  .calculator-info {
    padding: 1.2rem;
  }
}

@media (max-width: 480px) {
  .calculator-container {
    padding: 1rem;
  }
  
  .display-current {
    font-size: 1.75rem;
  }
  
  .calc-button {
    padding: 0.875rem;
    font-size: 1rem;
    min-height: 45px;
  }
}
</style>