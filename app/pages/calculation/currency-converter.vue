<template>
  <div class="currency-converter-page">
    <h1 class="page-title">汇率转换器</h1>
    
    <div class="currency-converter-container">
      <!-- 汇率信息提示 -->
      <div class="exchange-rate-info">
        <p>当前汇率数据：<span class="rate-date">{{ rateDate }}</span></p>
      </div>
      
      <!-- 转换器主体 -->
      <div class="converter-main">
        <!-- 输入区域 -->
        <div class="converter-inputs">
          <div class="input-group">
            <label for="fromCurrency">从：</label>
            <div class="input-row">
              <input 
                type="number" 
                id="fromAmount" 
                v-model="fromAmount"
                @input="convertCurrency"
                placeholder="输入金额"
              >
              <select 
                id="fromCurrency" 
                v-model="fromCurrency"
                @change="convertCurrency"
              >
                <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                  {{ currency.name }} ({{ currency.code }})
                </option>
              </select>
            </div>
          </div>
          
          <!-- 交换按钮 -->
          <div class="swap-container">
            <button class="swap-btn" @click="swapCurrencies">
              ⇄
            </button>
          </div>
          
          <div class="input-group">
            <label for="toCurrency">到：</label>
            <div class="input-row">
              <input 
                type="number" 
                id="toAmount" 
                v-model="toAmount"
                @input="convertCurrencyReverse"
                placeholder="转换结果"
                :disabled="!fromAmount"
              >
              <select 
                id="toCurrency" 
                v-model="toCurrency"
                @change="convertCurrency"
              >
                <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                  {{ currency.name }} ({{ currency.code }})
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 转换结果 -->
        <div class="conversion-result" v-if="fromAmount">
          <h3>转换结果</h3>
          <div class="result-text">
            {{ fromAmount }} {{ getCurrencyName(fromCurrency) }} = 
            <span class="result-value">{{ toAmount }}</span> {{ getCurrencyName(toCurrency) }}
          </div>
          <div class="rate-details">
            汇率：1 {{ fromCurrency }} = {{ currentRate }} {{ toCurrency }}
          </div>
        </div>
        
        <!-- 常用货币 -->
        <div class="popular-currencies" v-if="popularRates.length > 0">
          <h3>常用货币汇率</h3>
          <div class="popular-rates-grid">
            <div 
              v-for="rate in popularRates" 
              :key="rate.code"
              class="popular-rate-item"
            >
              <span class="rate-code">{{ rate.code }}</span>
              <span class="rate-value">{{ rate.rate }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 快捷操作 -->
      <div class="quick-actions">
        <button class="quick-btn" @click="resetConverter">重置</button>
        <button class="quick-btn" @click="setAmount(100)">100</button>
        <button class="quick-btn" @click="setAmount(500)">500</button>
        <button class="quick-btn" @click="setAmount(1000)">1000</button>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="currency-converter-info">
      <h2>功能说明</h2>
      <p>汇率转换器提供实时货币转换服务，支持全球主要货币。</p>
      <ul>
        <li>支持多种货币之间的相互转换</li>
        <li>提供常用货币的快速汇率查询</li>
        <li>支持金额输入和双向转换</li>
        <li>可一键交换源货币和目标货币</li>
        <li>提供快捷金额按钮，方便快速输入</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 货币列表（简化版本，实际项目中可从API获取）
const currencies = ref([
  { code: 'USD', name: '美元' },
  { code: 'CNY', name: '人民币' },
  { code: 'EUR', name: '欧元' },
  { code: 'GBP', name: '英镑' },
  { code: 'JPY', name: '日元' },
  { code: 'CAD', name: '加元' },
  { code: 'AUD', name: '澳元' },
  { code: 'CHF', name: '瑞士法郎' },
  { code: 'HKD', name: '港币' },
  { code: 'SGD', name: '新加坡元' }
])

// 转换状态
const fromAmount = ref(100)
const fromCurrency = ref('USD')
const toCurrency = ref('CNY')
const toAmount = ref(0)
const currentRate = ref(0)
const rateDate = ref(new Date().toLocaleDateString())

// 常用汇率（模拟数据）
const popularRates = ref([
  { code: 'USD', rate: '1.00' },
  { code: 'CNY', rate: '7.25' },
  { code: 'EUR', rate: '0.92' },
  { code: 'GBP', rate: '0.79' },
  { code: 'JPY', rate: '149.50' },
  { code: 'CAD', rate: '1.35' }
])

// 获取货币名称
const getCurrencyName = (code) => {
  const currency = currencies.value.find(c => c.code === code)
  return currency ? currency.name : code
}

// 转换货币
const convertCurrency = () => {
  if (!fromAmount.value) {
    toAmount.value = 0
    return
  }
  
  // 模拟汇率计算（实际项目中应从API获取）
  // 这里使用简化的汇率数据
  const rates = {
    USD: { CNY: 7.25, EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.35, AUD: 1.52, CHF: 0.88, HKD: 7.81, SGD: 1.33 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.62, CAD: 0.19, AUD: 0.21, CHF: 0.12, HKD: 1.08, SGD: 0.18 },
    EUR: { USD: 1.09, CNY: 7.88, GBP: 0.86, JPY: 162.50, CAD: 1.47, AUD: 1.65, CHF: 0.96, HKD: 8.49, SGD: 1.45 },
    GBP: { USD: 1.27, CNY: 9.18, EUR: 1.17, JPY: 189.20, CAD: 1.71, AUD: 1.92, CHF: 1.12, HKD: 9.88, SGD: 1.68 },
    JPY: { USD: 0.0067, CNY: 0.048, EUR: 0.0061, GBP: 0.0053, CAD: 0.0090, AUD: 0.010, CHF: 0.0059, HKD: 0.052, SGD: 0.0089 },
    CAD: { USD: 0.74, CNY: 5.37, EUR: 0.68, GBP: 0.59, JPY: 111.00, AUD: 1.13, CHF: 0.65, HKD: 5.79, SGD: 0.98 },
    AUD: { USD: 0.66, CNY: 4.77, EUR: 0.61, GBP: 0.52, JPY: 98.50, CAD: 0.88, CHF: 0.58, HKD: 5.12, SGD: 0.88 },
    CHF: { USD: 1.14, CNY: 8.24, EUR: 1.04, GBP: 0.89, JPY: 170.00, CAD: 1.54, AUD: 1.72, HKD: 8.87, SGD: 1.51 },
    HKD: { USD: 0.13, CNY: 0.92, EUR: 0.12, GBP: 0.10, JPY: 19.14, CAD: 0.17, AUD: 0.19, CHF: 0.11, SGD: 0.17 },
    SGD: { USD: 0.75, CNY: 5.45, EUR: 0.69, GBP: 0.59, JPY: 112.50, CAD: 1.02, AUD: 1.14, CHF: 0.66, HKD: 5.94 }
  }
  
  // 获取汇率
  const rate = rates[fromCurrency.value]?.[toCurrency.value] || 0
  currentRate.value = rate
  
  // 计算转换结果
  toAmount.value = (fromAmount.value * rate).toFixed(2)
}

// 反向转换（从目标货币到源货币）
const convertCurrencyReverse = () => {
  if (!toAmount.value) {
    fromAmount.value = 0
    return
  }
  
  // 模拟汇率计算（实际项目中应从API获取）
  const rates = {
    USD: { CNY: 7.25, EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.35, AUD: 1.52, CHF: 0.88, HKD: 7.81, SGD: 1.33 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.62, CAD: 0.19, AUD: 0.21, CHF: 0.12, HKD: 1.08, SGD: 0.18 },
    EUR: { USD: 1.09, CNY: 7.88, GBP: 0.86, JPY: 162.50, CAD: 1.47, AUD: 1.65, CHF: 0.96, HKD: 8.49, SGD: 1.45 },
    GBP: { USD: 1.27, CNY: 9.18, EUR: 1.17, JPY: 189.20, CAD: 1.71, AUD: 1.92, CHF: 1.12, HKD: 9.88, SGD: 1.68 },
    JPY: { USD: 0.0067, CNY: 0.048, EUR: 0.0061, GBP: 0.0053, CAD: 0.0090, AUD: 0.010, CHF: 0.0059, HKD: 0.052, SGD: 0.0089 },
    CAD: { USD: 0.74, CNY: 5.37, EUR: 0.68, GBP: 0.59, JPY: 111.00, AUD: 1.13, CHF: 0.65, HKD: 5.79, SGD: 0.98 },
    AUD: { USD: 0.66, CNY: 4.77, EUR: 0.61, GBP: 0.52, JPY: 98.50, CAD: 0.88, CHF: 0.58, HKD: 5.12, SGD: 0.88 },
    CHF: { USD: 1.14, CNY: 8.24, EUR: 1.04, GBP: 0.89, JPY: 170.00, CAD: 1.54, AUD: 1.72, HKD: 8.87, SGD: 1.51 },
    HKD: { USD: 0.13, CNY: 0.92, EUR: 0.12, GBP: 0.10, JPY: 19.14, CAD: 0.17, AUD: 0.19, CHF: 0.11, SGD: 0.17 },
    SGD: { USD: 0.75, CNY: 5.45, EUR: 0.69, GBP: 0.59, JPY: 112.50, CAD: 1.02, AUD: 1.14, CHF: 0.66, HKD: 5.94 }
  }
  
  // 获取反向汇率
  const rate = rates[toCurrency.value]?.[fromCurrency.value] || 0
  currentRate.value = 1 / rate // 显示正向汇率
  
  // 计算转换结果
  fromAmount.value = (toAmount.value * rate).toFixed(2)
}

// 交换货币
const swapCurrencies = () => {
  const tempCurrency = fromCurrency.value
  const tempAmount = fromAmount.value
  
  fromCurrency.value = toCurrency.value
  fromAmount.value = toAmount.value
  
  toCurrency.value = tempCurrency
  toAmount.value = tempAmount
  
  convertCurrency()
}

// 重置转换器
const resetConverter = () => {
  fromAmount.value = 100
  fromCurrency.value = 'USD'
  toCurrency.value = 'CNY'
  convertCurrency()
}

// 设置金额
const setAmount = (amount) => {
  fromAmount.value = amount
  convertCurrency()
}

// 初始化
onMounted(() => {
  convertCurrency()
})
</script>

<style>
@import './CurrencyConverter.css';
</style>
