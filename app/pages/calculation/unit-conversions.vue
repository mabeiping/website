<template>
  <div class="unit-converter-page">
    <h1 class="page-title">单位转换工具</h1>
    
    <div class="converter-container">
      <div class="category-section">
        <h3>转换类别</h3>
        <div class="category-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>
      
      <div class="conversion-section">
        <h3>{{ getCategoryName() }}转换</h3>
        
        <div class="converter-inputs">
          <div class="input-group">
            <label class="input-label">输入数值</label>
            <input 
              type="number" 
              v-model.number="inputValue" 
              @input="convert"
              class="number-input"
              placeholder="输入数值"
            />
          </div>
          
          <div class="unit-select-group">
            <label class="input-label">从</label>
            <select v-model="fromUnit" @change="convert" class="unit-select">
              <option v-for="unit in getUnits()" :key="unit.value" :value="unit.value">
                {{ unit.name }}
              </option>
            </select>
          </div>
          
          <div class="unit-select-group">
            <label class="input-label">到</label>
            <select v-model="toUnit" @change="convert" class="unit-select">
              <option v-for="unit in getUnits()" :key="unit.value" :value="unit.value">
                {{ unit.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="conversionResult !== null" class="result-section">
          <h4>转换结果</h4>
          <div class="result-display">
            <div class="result-value">
              <span class="result-number">{{ conversionResult }}</span>
              <span class="result-unit">{{ getUnitName(toUnit) }}</span>
            </div>
            <button class="copy-button" @click="copyResult">
              📋 复制
            </button>
          </div>
        </div>
        
        <div class="formula-section">
          <h4>转换公式</h4>
          <div class="formula-display">
            {{ getFormula() }}
          </div>
        </div>
      </div>
      
      <div class="quick-convert-section">
        <h3>常用转换</h3>
        <div class="quick-convert-grid">
          <button 
            v-for="(quick, index) in quickConversions" 
            :key="index"
            class="quick-convert-btn"
            @click="quickConvert(quick)"
          >
            {{ quick.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的单位转换工具，支持多种单位类别的相互转换。</p>
      <ul>
        <li>支持长度、重量、面积、体积、温度、时间、速度、数据存储等多种单位</li>
        <li>实时转换，输入数值后立即显示结果</li>
        <li>显示转换公式，帮助理解转换原理</li>
        <li>提供常用转换快捷按钮</li>
        <li>支持一键复制转换结果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('length')
const inputValue = ref('')
const fromUnit = ref('m')
const toUnit = ref('cm')
const conversionResult = ref(null)

const categories = [
  { id: 'length', name: '长度', icon: '📏' },
  { id: 'weight', name: '重量', icon: '⚖️' },
  { id: 'area', name: '面积', icon: '📐' },
  { id: 'volume', name: '体积', icon: '📦' },
  { id: 'temperature', name: '温度', icon: '🌡️' },
  { id: 'time', name: '时间', icon: '⏱️' },
  { id: 'speed', name: '速度', icon: '🚀' },
  { id: 'data', name: '数据存储', icon: '💾' }
]

const units = {
  length: [
    { value: 'km', name: '千米', factor: 1000 },
    { value: 'm', name: '米', factor: 1 },
    { value: 'cm', name: '厘米', factor: 0.01 },
    { value: 'mm', name: '毫米', factor: 0.001 },
    { value: 'mi', name: '英里', factor: 1609.34 },
    { value: 'ft', name: '英尺', factor: 3.28084 },
    { value: 'in', name: '英寸', factor: 0.0833333 }
  ],
  weight: [
    { value: 't', name: '吨', factor: 1000 },
    { value: 'kg', name: '千克', factor: 1 },
    { value: 'g', name: '克', factor: 0.001 },
    { value: 'mg', name: '毫克', factor: 0.000001 },
    { value: 'lb', name: '磅', factor: 0.453592 },
    { value: 'oz', name: '盎司', factor: 0.0283495 }
  ],
  area: [
    { value: 'km2', name: '平方千米', factor: 1000000 },
    { value: 'm2', name: '平方米', factor: 1 },
    { value: 'cm2', name: '平方厘米', factor: 0.0001 },
    { value: 'mm2', name: '平方毫米', factor: 0.000001 },
    { value: 'ha', name: '公顷', factor: 10000 },
    { value: 'acre', name: '英亩', factor: 4046.86 }
  ],
  volume: [
    { value: 'm3', name: '立方米', factor: 1 },
    { value: 'cm3', name: '立方厘米', factor: 0.000001 },
    { value: 'l', name: '升', factor: 0.001 },
    { value: 'ml', name: '毫升', factor: 0.000001 },
    { value: 'gal', name: '加仑', factor: 0.00378541 },
    { value: 'fl_oz', name: '液量盎司', factor: 0.0295735 }
  ],
  temperature: [
    { value: 'c', name: '摄氏度', factor: 1 },
    { value: 'f', name: '华氏度', factor: 1 },
    { value: 'k', name: '开尔文', factor: 1 }
  ],
  time: [
    { value: 'year', name: '年', factor: 31536000 },
    { value: 'month', name: '月', factor: 2592000 },
    { value: 'day', name: '天', factor: 86400 },
    { value: 'hour', name: '小时', factor: 3600 },
    { value: 'minute', name: '分钟', factor: 60 },
    { value: 'second', name: '秒', factor: 1 }
  ],
  speed: [
    { value: 'kmh', name: '千米/小时', factor: 1 },
    { value: 'mh', name: '米/小时', factor: 0.001 },
    { value: 'ms', name: '米/秒', factor: 0.000277778 },
    { value: 'mph', name: '英里/小时', factor: 0.621371 },
    { value: 'fts', name: '英尺/秒', factor: 0.911344 }
  ],
  data: [
    { value: 'tb', name: 'TB', factor: 1099511627776 },
    { value: 'gb', name: 'GB', factor: 1073741824 },
    { value: 'mb', name: 'MB', factor: 1048576 },
    { value: 'kb', name: 'KB', factor: 1024 },
    { value: 'byte', name: 'Byte', factor: 1 },
    { value: 'bit', name: 'Bit', factor: 0.125 }
  ]
}

const quickConversions = computed(() => {
  const quickMap = {
    length: [
      { name: '1米 → 厘米', value: 100, from: 'm', to: 'cm' },
      { name: '1千米 → 米', value: 1000, from: 'km', to: 'm' },
      { name: '1英尺 → 英寸', value: 12, from: 'ft', to: 'in' }
    ],
    weight: [
      { name: '1千克 → 克', value: 1000, from: 'kg', to: 'g' },
      { name: '1吨 → 千克', value: 1000, from: 't', to: 'kg' },
      { name: '1磅 → 千克', value: 0.453592, from: 'lb', to: 'kg' }
    ],
    area: [
      { name: '1平方米 → 平方厘米', value: 10000, from: 'm2', to: 'cm2' },
      { name: '1公顷 → 平方米', value: 10000, from: 'ha', to: 'm2' }
    ],
    volume: [
      { name: '1立方米 → 升', value: 1000, from: 'm3', to: 'l' },
      { name: '1升 → 毫升', value: 1000, from: 'l', to: 'ml' }
    ],
    temperature: [
      { name: '0°C → °F', value: 0, from: 'c', to: 'f' },
      { name: '100°C → °F', value: 100, from: 'c', to: 'f' }
    ],
    time: [
      { name: '1小时 → 分钟', value: 60, from: 'hour', to: 'minute' },
      { name: '1天 → 小时', value: 24, from: 'day', to: 'hour' }
    ],
    speed: [
      { name: '100km/h → m/s', value: 100, from: 'kmh', to: 'ms' },
      { name: '60km/h → m/s', value: 60, from: 'kmh', to: 'ms' }
    ],
    data: [
      { name: '1GB → MB', value: 1, from: 'gb', to: 'mb' },
      { name: '1MB → KB', value: 1, from: 'mb', to: 'kb' }
    ]
  }
  return quickMap[selectedCategory.value] || []
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  const categoryUnits = units[categoryId]
  if (categoryUnits && categoryUnits.length > 0) {
    fromUnit.value = categoryUnits[0].value
    toUnit.value = categoryUnits[1]?.value || categoryUnits[0].value
  }
  inputValue.value = ''
  conversionResult.value = null
}

const getCategoryName = () => {
  const category = categories.find(c => c.id === selectedCategory.value)
  return category ? category.name : ''
}

const getUnits = () => {
  return units[selectedCategory.value] || []
}

const getUnitName = (unitValue) => {
  const unitList = getUnits()
  const unit = unitList.find(u => u.value === unitValue)
  return unit ? unit.name : ''
}

const getFormula = () => {
  if (selectedCategory.value === 'temperature') {
    if (fromUnit.value === 'c' && toUnit.value === 'f') {
      return '°F = °C × 9/5 + 32'
    } else if (fromUnit.value === 'f' && toUnit.value === 'c') {
      return '°C = (°F - 32) × 5/9'
    }
  }
  return `${inputValue.value} ${getUnitName(fromUnit.value)} = ${conversionResult.value} ${getUnitName(toUnit.value)}`
}

const convert = () => {
  if (inputValue.value === '' || inputValue.value === null) {
    conversionResult.value = null
    return
  }
  
  const unitList = getUnits()
  const fromUnitData = unitList.find(u => u.value === fromUnit.value)
  const toUnitData = unitList.find(u => u.value === toUnit.value)
  
  if (!fromUnitData || !toUnitData) return
  
  if (selectedCategory.value === 'temperature') {
    convertTemperature()
  } else {
    const baseValue = inputValue.value * fromUnitData.factor
    const result = baseValue / toUnitData.factor
    conversionResult.value = formatResult(result)
  }
}

const convertTemperature = () => {
  const value = inputValue.value
  
  if (fromUnit.value === 'c' && toUnit.value === 'f') {
    conversionResult.value = formatResult((value * 9/5) + 32)
  } else if (fromUnit.value === 'f' && toUnit.value === 'c') {
    conversionResult.value = formatResult((value - 32) * 5/9)
  } else if (fromUnit.value === 'c' && toUnit.value === 'k') {
    conversionResult.value = formatResult(value + 273.15)
  } else if (fromUnit.value === 'k' && toUnit.value === 'c') {
    conversionResult.value = formatResult(value - 273.15)
  } else {
    conversionResult.value = formatResult(value)
  }
}

const formatResult = (value) => {
  if (value === null || value === undefined) return ''
  
  const num = Number(value)
  if (isNaN(num)) return ''
  
  if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000) {
    return num.toExponential(4)
  } else if (Math.abs(num) < 0.01) {
    return num.toFixed(6)
  } else if (Math.abs(num) < 100) {
    return num.toFixed(4)
  } else {
    return num.toFixed(2)
  }
}

const quickConvert = (quick) => {
  inputValue.value = quick.value
  fromUnit.value = quick.from
  toUnit.value = quick.to
  convert()
}

const copyResult = async () => {
  if (conversionResult.value === null) return
  
  try {
    await navigator.clipboard.writeText(`${conversionResult.value} ${getUnitName(toUnit.value)}`)
    alert('已复制到剪贴板')
  } catch (err) {
    alert('复制失败')
  }
}
</script>

<style scoped>
.unit-converter-page {
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 1.5rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.converter-container {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
}

.category-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.category-card.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.category-icon {
  font-size: 2rem;
}

.category-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.conversion-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.conversion-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.converter-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.number-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.number-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.unit-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.unit-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unit-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.result-section {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.result-section h4 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.result-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.result-value {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.result-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: 'Consolas', 'Monaco', monospace;
}

.result-unit {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.copy-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.formula-section {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.formula-section h4 {
  margin: 0 0 0.75rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.formula-display {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  padding: 0.75rem;
  background-color: var(--color-bg-primary);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.quick-convert-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-convert-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.quick-convert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.quick-convert-btn {
  padding: 0.625rem 1rem;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-convert-btn:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

.info-section {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.info-section h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.info-section p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.info-section ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.info-section ul li {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .unit-converter-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .converter-container {
    padding: 1.5rem;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .converter-inputs {
    gap: 0.75rem;
  }

  .result-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .quick-convert-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
