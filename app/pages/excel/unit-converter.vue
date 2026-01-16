<template>
  <div class="unit-converter-page">
    <div class="converter-layout">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>🔄 单位转换器</h2>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3>转换类型</h3>
            <div class="nav-items">
              <button 
                v-for="type in conversionTypes" 
                :key="type.id"
                class="nav-item"
                :class="{ active: selectedType === type.id }"
                @click="selectType(type.id)"
              >
                <span class="nav-icon">{{ type.icon }}</span>
                <span class="nav-label">{{ type.name }}</span>
              </button>
            </div>
          </div>
          
          <div class="nav-section">
            <h3>历史记录</h3>
            <button class="nav-item history-toggle" @click="showHistory = !showHistory">
              <span class="nav-icon">📋</span>
              <span class="nav-label">{{ showHistory ? '隐藏历史' : '查看历史' }}</span>
            </button>
          </div>
          
          <div class="nav-section">
            <h3>快捷功能</h3>
            <div class="nav-items">
              <button class="nav-item" @click="showCustom = !showCustom">
                <span class="nav-icon">⚙️</span>
                <span class="nav-label">自定义单位</span>
              </button>
              <button class="nav-item" @click="showBatch = !showBatch">
                <span class="nav-icon">📊</span>
                <span class="nav-label">批量转换</span>
              </button>
              <button class="nav-item" @click="showFavorites = !showFavorites">
                <span class="nav-icon">⭐</span>
                <span class="nav-label">收藏夹</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
      
      <!-- 内容区域 -->
      <main class="main-content">
        <!-- 单位转换器 -->
        <div v-if="!showHistory && !showCustom && !showBatch" class="converter-container">
          <div class="converter-header">
            <h2>{{ getTypeName(selectedType) }}转换</h2>
            <div class="converter-actions">
              <button class="action-btn" @click="copyResult">
                <span class="icon">📄</span> 复制结果
              </button>
              <button class="action-btn" @click="addToFavorites">
                <span class="icon">{{ isFavorite() ? '⭐' : '☆' }}</span> {{ isFavorite() ? '已收藏' : '添加收藏' }}
              </button>
            </div>
          </div>
          
          <!-- 转换输入区域 -->
          <div class="conversion-input-area">
            <div class="input-group">
              <label>输入数值</label>
              <input 
                type="number" 
                v-model.number="inputValue" 
                @input="convert"
                placeholder="请输入要转换的数值"
                class="main-input"
              >
            </div>
            
            <div class="unit-selector-group">
              <div class="unit-selector">
                <label>从</label>
                <select v-model="fromUnit" @change="convert" class="unit-select">
                  <option v-for="unit in units[selectedType]" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
              </div>
              
              <button class="swap-button" @click="swapUnits" title="交换单位">
                ⇄
              </button>
              
              <div class="unit-selector">
                <label>到</label>
                <select v-model="toUnit" @change="convert" class="unit-select">
                  <option v-for="unit in units[selectedType]" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- 转换结果展示 -->
          <div class="conversion-result">
            <div class="result-main">
              <div class="result-value">{{ outputValue }}</div>
              <div class="result-unit">{{ getUnitLabel(toUnit) }}</div>
            </div>
            <div class="result-formula" v-if="conversionFormula">
              <span class="formula-label">转换公式：</span>
              <span class="formula-text">{{ conversionFormula }}</span>
            </div>
          </div>
          
          <!-- 常用转换快捷方式 -->
          <div class="quick-conversions">
            <h3>常用转换</h3>
            <div class="quick-conversion-grid">
              <button 
                v-for="(quick, index) in getQuickConversions()" 
                :key="index"
                class="quick-conversion-btn"
                @click="applyQuickConversion(quick)"
              >
                <div class="quick-from">{{ quick.from }}</div>
                <div class="quick-arrow">→</div>
                <div class="quick-to">{{ quick.to }}</div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 历史记录面板 -->
        <div v-if="showHistory" class="history-panel">
          <div class="panel-header">
            <h2>📋 转换历史</h2>
            <div class="panel-actions">
              <button class="panel-btn" @click="clearHistory">清空</button>
              <button class="panel-btn" @click="exportHistory">导出</button>
            </div>
          </div>
          
          <div class="history-list">
            <div 
              v-for="(item, index) in history" 
              :key="index" 
              class="history-item"
              @click="useHistoryItem(item)"
            >
              <div class="history-info">
                <div class="history-type">{{ getTypeName(item.type) }}</div>
                <div class="history-conversion">
                  <span class="history-value">{{ item.inputValue }}</span>
                  <span class="history-unit">{{ getUnitLabel(item.fromUnit) }}</span>
                  <span class="history-arrow">→</span>
                  <span class="history-value">{{ item.outputValue }}</span>
                  <span class="history-unit">{{ getUnitLabel(item.toUnit) }}</span>
                </div>
                <div class="history-time">{{ formatTime(item.timestamp) }}</div>
              </div>
              <button class="history-delete" @click.stop="deleteHistoryItem(index)" title="删除">🗑️</button>
            </div>
            
            <div v-if="history.length === 0" class="empty-history">
              <p>暂无转换历史</p>
            </div>
          </div>
        </div>
        
        <!-- 自定义单位面板 -->
        <div v-if="showCustom" class="custom-panel">
          <div class="panel-header">
            <h2>⚙️ 自定义单位</h2>
            <button class="panel-btn" @click="showCustom = false">关闭</button>
          </div>
          
          <div class="custom-form">
            <div class="form-group">
              <label>转换类型</label>
              <select v-model="customType" class="form-select">
                <option value="length">长度</option>
                <option value="weight">重量</option>
                <option value="temperature">温度</option>
                <option value="area">面积</option>
                <option value="volume">体积</option>
                <option value="time">时间</option>
                <option value="data">数据</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>单位名称</label>
              <input type="text" v-model="customUnitName" placeholder="如：市尺" class="form-input">
            </div>
            
            <div class="form-group">
              <label>转换系数（相对于基准单位）</label>
              <input type="number" v-model.number="customFactor" placeholder="如：0.333" step="0.0001" class="form-input">
            </div>
            
            <div class="form-group">
              <label>符号</label>
              <input type="text" v-model="customSymbol" placeholder="如：尺" class="form-input">
            </div>
            
            <button class="form-submit-btn" @click="addCustomUnit">添加自定义单位</button>
          </div>
          
          <div class="custom-units-list">
            <h3>已添加的自定义单位</h3>
            <div class="custom-units">
              <div 
                v-for="(unit, index) in customUnits" 
                :key="index" 
                class="custom-unit-item"
              >
                <div class="custom-unit-info">
                  <span class="unit-name">{{ unit.name }}</span>
                  <span class="unit-factor">系数：{{ unit.factor }}</span>
                  <span class="unit-symbol">{{ unit.symbol }}</span>
                </div>
                <button class="custom-unit-delete" @click="deleteCustomUnit(index)">🗑️</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 批量转换面板 -->
        <div v-if="showBatch" class="batch-panel">
          <div class="panel-header">
            <h2>📊 批量转换</h2>
            <button class="panel-btn" @click="showBatch = false">关闭</button>
          </div>
          
          <div class="batch-form">
            <div class="form-group">
              <label>输入数值（每行一个，支持批量粘贴）</label>
              <textarea 
                v-model="batchInput" 
                placeholder="例如：&#10;100&#10;200&#10;300"
                rows="10"
                class="batch-textarea"
              ></textarea>
            </div>
            
            <div class="batch-unit-selector">
              <div class="unit-selector">
                <label>从单位</label>
                <select v-model="batchFromUnit" class="unit-select">
                  <option v-for="unit in units[selectedType]" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
              </div>
              
              <div class="unit-selector">
                <label>到单位</label>
                <select v-model="batchToUnit" class="unit-select">
                  <option v-for="unit in units[selectedType]" :key="unit.value" :value="unit.value">
                    {{ unit.label }}
                  </option>
                </select>
              </div>
            </div>
            
            <button class="form-submit-btn" @click="convertBatch">执行批量转换</button>
          </div>
          
          <div class="batch-results" v-if="batchResults.length > 0">
            <h3>转换结果</h3>
            <div class="batch-results-list">
              <div v-for="(result, index) in batchResults" :key="index" class="batch-result-item">
                <div class="batch-input">{{ result.input }}</div>
                <div class="batch-arrow">→</div>
                <div class="batch-output">{{ result.output }} {{ getUnitLabel(batchToUnit) }}</div>
              </div>
            </div>
            <div class="batch-actions">
              <button class="action-btn" @click="copyBatchResults">复制全部结果</button>
              <button class="action-btn" @click="exportBatchResults">导出结果</button>
            </div>
          </div>
        </div>
        
        <!-- 收藏面板 -->
        <div v-if="showFavorites" class="favorites-panel">
          <div class="panel-header">
            <h2>⭐ 收藏夹</h2>
            <button class="panel-btn" @click="showFavorites = false">关闭</button>
          </div>
          
          <div class="favorites-list">
            <div v-if="favorites.length === 0" class="empty-favorites">
              <p>暂无收藏</p>
            </div>
            
            <div 
              v-for="(item, index) in favorites" 
              :key="index" 
              class="favorite-item"
            >
              <div class="favorite-info">
                <div class="favorite-type">{{ getTypeName(item.type) }}</div>
                <div class="favorite-conversion">
                  <span class="favorite-unit">{{ getUnitLabel(item.fromUnit) }}</span>
                  <span class="favorite-arrow">→</span>
                  <span class="favorite-unit">{{ getUnitLabel(item.toUnit) }}</span>
                </div>
                <div class="favorite-time">{{ formatTime(item.timestamp) }}</div>
              </div>
              <div class="favorite-actions">
                <button class="use-favorite-btn" @click="useFavorite(item)">使用</button>
                <button class="remove-favorite-btn" @click="removeFromFavorites(index)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// 转换类型定义
const conversionTypes = [
  { id: 'length', name: '长度', icon: '📏' },
  { id: 'weight', name: '重量', icon: '⚖️' },
  { id: 'temperature', name: '温度', icon: '🌡️' },
  { id: 'area', name: '面积', icon: '📐' },
  { id: 'volume', name: '体积', icon: '📦' },
  { id: 'time', name: '时间', icon: '⏰' },
  { id: 'data', name: '数据', icon: '💾' }
]

// 单位定义（扩展版）
const units = {
  length: [
    { value: 'm', label: '米', toM: 1 },
    { value: 'km', label: '千米', toM: 1000 },
    { value: 'cm', label: '厘米', toM: 0.01 },
    { value: 'mm', label: '毫米', toM: 0.001 },
    { value: 'um', label: '微米', toM: 0.000001 },
    { value: 'nm', label: '纳米', toM: 0.000000001 },
    { value: 'in', label: '英寸', toM: 0.0254 },
    { value: 'ft', label: '英尺', toM: 0.3048 },
    { value: 'yd', label: '码', toM: 0.9144 },
    { value: 'mi', label: '英里', toM: 1609.34 }
  ],
  weight: [
    { value: 'kg', label: '千克', toKg: 1 },
    { value: 'g', label: '克', toKg: 0.001 },
    { value: 'mg', label: '毫克', toKg: 0.000001 },
    { value: 't', label: '吨', toKg: 1000 },
    { value: 'lb', label: '磅', toKg: 0.453592 },
    { value: 'oz', label: '盎司', toKg: 0.0283495 },
    { value: 'jin', label: '市斤', toKg: 0.5 },
    { value: 'liang', label: '市两', toKg: 0.05 }
  ],
  temperature: [
    { value: 'c', label: '摄氏度 (°C)', toC: 1 },
    { value: 'f', label: '华氏度 (°F)', toC: (f) => (f - 32) * 5/9 },
    { value: 'k', label: '开尔文 (K)', toC: (k) => k - 273.15 }
  ],
  area: [
    { value: 'm2', label: '平方米', toM2: 1 },
    { value: 'km2', label: '平方千米', toM2: 1000000 },
    { value: 'cm2', label: '平方厘米', toM2: 0.0001 },
    { value: 'mm2', label: '平方毫米', toM2: 0.000001 },
    { value: 'in2', label: '平方英寸', toM2: 0.00064516 },
    { value: 'ft2', label: '平方英尺', toM2: 0.092903 },
    { value: 'yd2', label: '平方码', toM2: 0.836127 },
    { value: 'acre', label: '英亩', toM2: 4046.86 },
    { value: 'ha', label: '公顷', toM2: 10000 },
    { value: 'mu', label: '市亩', toM2: 666.67 }
  ],
  volume: [
    { value: 'l', label: '升', toL: 1 },
    { value: 'ml', label: '毫升', toL: 0.001 },
    { value: 'm3', label: '立方米', toL: 1000 },
    { value: 'cm3', label: '立方厘米', toL: 0.001 },
    { value: 'in3', label: '立方英寸', toL: 0.016387 },
    { value: 'ft3', label: '立方英尺', toL: 28.3168 },
    { value: 'gal', label: '加仑(美)', toL: 3.78541 },
    { value: 'qt', label: '夸脱', toL: 0.946353 }
  ],
  time: [
    { value: 's', label: '秒', toS: 1 },
    { value: 'ms', label: '毫秒', toS: 0.001 },
    { value: 'min', label: '分钟', toS: 60 },
    { value: 'h', label: '小时', toS: 3600 },
    { value: 'd', label: '天', toS: 86400 },
    { value: 'wk', label: '周', toS: 604800 },
    { value: 'mo', label: '月', toS: 2592000 },
    { value: 'yr', label: '年', toS: 31536000 }
  ],
  data: [
    { value: 'b', label: '字节(B)', toB: 1 },
    { value: 'kb', label: '千字节(KB)', toB: 1024 },
    { value: 'mb', label: '兆字节(MB)', toB: 1048576 },
    { value: 'gb', label: '吉字节(GB)', toB: 1073741824 },
    { value: 'tb', label: '太字节(TB)', toB: 1099511627776 }
  ]
}

// 响应式状态
const selectedType = ref('length')
const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('')
const toUnit = ref('')
const conversionFormula = ref('')
const showHistory = ref(false)
const showCustom = ref(false)
const showBatch = ref(false)
const showFavorites = ref(false)
const history = ref([])
const customUnits = ref([])
const batchInput = ref('')
const batchFromUnit = ref('')
const batchToUnit = ref('')
const batchResults = ref([])
const favorites = ref([])

// 自定义单位表单
const customType = ref('length')
const customUnitName = ref('')
const customFactor = ref('')
const customSymbol = ref('')

// 获取类型名称
const getTypeName = (type) => {
  const typeObj = conversionTypes.find(t => t.id === type)
  return typeObj ? typeObj.name : '未知'
}

// 获取单位标签
const getUnitLabel = (unitValue) => {
  const unitList = units[selectedType.value]
  const unit = unitList.find(u => u.value === unitValue)
  return unit ? unit.label : unitValue
}

// 选择转换类型
const selectType = (typeId) => {
  selectedType.value = typeId
  resetConversion()
}

// 重置转换
const resetConversion = () => {
  inputValue.value = ''
  outputValue.value = ''
  conversionFormula.value = ''
  initUnits()
}

// 初始化单位选择
const initUnits = () => {
  const unitList = units[selectedType.value]
  if (unitList.length > 0) {
    fromUnit.value = unitList[0].value
    toUnit.value = unitList[1] ? unitList[1].value : unitList[0].value
  }
}

// 交换单位
const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
  convert()
}

// 执行转换
const convert = () => {
  if (inputValue.value === '' || isNaN(inputValue.value)) {
    outputValue.value = ''
    conversionFormula.value = ''
    return
  }
  
  const value = parseFloat(inputValue.value)
  let result = 0
  let formula = ''
  
  const fromUnitObj = units[selectedType.value].find(u => u.value === fromUnit.value)
  const toUnitObj = units[selectedType.value].find(u => u.value === toUnit.value)
  
  if (!fromUnitObj || !toUnitObj) return
  
  // 根据类型执行转换
  switch (selectedType.value) {
    case 'length':
      const meters = value * fromUnitObj.toM
      result = meters / toUnitObj.toM
      formula = `${value} ${fromUnitObj.label} = ${meters.toFixed(6)} 米 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
    case 'weight':
      const kg = value * fromUnitObj.toKg
      result = kg / toUnitObj.toKg
      formula = `${value} ${fromUnitObj.label} = ${kg.toFixed(6)} 千克 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
    case 'temperature':
      const celsius = fromUnitObj.toC(value)
      result = toUnitObj.toC(celsius)
      formula = `${value} ${fromUnitObj.label} = ${celsius.toFixed(2)} 摄氏度 = ${result.toFixed(2)} ${toUnitObj.label}`
      break
    case 'area':
      const m2 = value * fromUnitObj.toM2
      result = m2 / toUnitObj.toM2
      formula = `${value} ${fromUnitObj.label} = ${m2.toFixed(6)} 平方米 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
    case 'volume':
      const liters = value * fromUnitObj.toL
      result = liters / toUnitObj.toL
      formula = `${value} ${fromUnitObj.label} = ${liters.toFixed(6)} 升 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
    case 'time':
      const seconds = value * fromUnitObj.toS
      result = seconds / toUnitObj.toS
      formula = `${value} ${fromUnitObj.label} = ${seconds.toFixed(2)} 秒 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
    case 'data':
      const bytes = value * fromUnitObj.toB
      result = bytes / toUnitObj.toB
      formula = `${value} ${fromUnitObj.label} = ${bytes.toFixed(2)} 字节 = ${result.toFixed(6)} ${toUnitObj.label}`
      break
  }
  
  outputValue.value = result.toFixed(6)
  conversionFormula.value = formula
  
  // 保存到历史记录
  saveToHistory()
}

// 保存到历史记录
const saveToHistory = () => {
  if (inputValue.value === '' || outputValue.value === '') return
  
  const historyItem = {
    type: selectedType.value,
    inputValue: inputValue.value,
    fromUnit: fromUnit.value,
    outputValue: outputValue.value,
    toUnit: toUnit.value,
    timestamp: new Date().toISOString()
  }
  
  history.value.unshift(historyItem)
  
  // 限制历史记录数量
  if (history.value.length > 50) {
    history.value.pop()
  }
}

// 使用历史记录项
const useHistoryItem = (item) => {
  selectedType.value = item.type
  inputValue.value = item.inputValue
  fromUnit.value = item.fromUnit
  toUnit.value = item.toUnit
  convert()
  showHistory.value = false
}

// 删除历史记录项
const deleteHistoryItem = (index) => {
  history.value.splice(index, 1)
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
}

// 导出历史记录
const exportHistory = () => {
  const text = history.value.map(item => 
    `${getTypeName(item.type)}: ${item.inputValue} ${getUnitLabel(item.fromUnit)} → ${item.outputValue} ${getUnitLabel(item.toUnit)} (${formatTime(item.timestamp)})`
  ).join('\n')
  
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `unit-conversion-history-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 格式化时间
const formatTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取快捷转换
const getQuickConversions = () => {
  const quickConversions = []
  const unitList = units[selectedType.value]
  
  if (unitList.length >= 2) {
    quickConversions.push({
      from: `1 ${unitList[0].label}`,
      to: `1 ${unitList[1].label}`
    })
  }
  
  if (unitList.length >= 3) {
    quickConversions.push({
      from: `1 ${unitList[1].label}`,
      to: `1 ${unitList[2].label}`
    })
  }
  
  return quickConversions
}

// 应用快捷转换
const applyQuickConversion = (quick) => {
  inputValue.value = '1'
  fromUnit.value = quick.from.split(' ')[1]
  toUnit.value = quick.to.split(' ')[1]
  convert()
}

// 添加自定义单位
const addCustomUnit = () => {
  if (!customUnitName.value || !customFactor.value) {
    alert('请填写单位名称和转换系数')
    return
  }
  
  const customUnit = {
    type: customType.value,
    name: customUnitName.value,
    factor: parseFloat(customFactor.value),
    symbol: customSymbol.value || customUnitName.value
  }
  
  customUnits.value.push(customUnit)
  
  // 清空表单
  customUnitName.value = ''
  customFactor.value = ''
  customSymbol.value = ''
  
  alert('自定义单位添加成功！')
}

// 删除自定义单位
const deleteCustomUnit = (index) => {
  customUnits.value.splice(index, 1)
}

// 批量转换
const convertBatch = () => {
  if (!batchInput.value.trim()) {
    alert('请输入要转换的数值')
    return
  }
  
  const lines = batchInput.value.trim().split('\n')
  const results = []
  
  lines.forEach(line => {
    const value = parseFloat(line.trim())
    if (!isNaN(value)) {
      const fromUnitObj = units[selectedType.value].find(u => u.value === batchFromUnit.value)
      const toUnitObj = units[selectedType.value].find(u => u.value === batchToUnit.value)
      
      if (fromUnitObj && toUnitObj) {
        let convertedValue = 0
        
        switch (selectedType.value) {
          case 'length':
            const meters = value * fromUnitObj.toM
            convertedValue = meters / toUnitObj.toM
            break
          case 'weight':
            const kg = value * fromUnitObj.toKg
            convertedValue = kg / toUnitObj.toKg
            break
          case 'temperature':
            const celsius = fromUnitObj.toC(value)
            convertedValue = toUnitObj.toC(celsius)
            break
          case 'area':
            const m2 = value * fromUnitObj.toM2
            convertedValue = m2 / toUnitObj.toM2
            break
          case 'volume':
            const liters = value * fromUnitObj.toL
            convertedValue = liters / toUnitObj.toL
            break
          case 'time':
            const seconds = value * fromUnitObj.toS
            convertedValue = seconds / toUnitObj.toS
            break
          case 'data':
            const bytes = value * fromUnitObj.toB
            convertedValue = bytes / toUnitObj.toB
            break
        }
        
        results.push({
          input: line.trim(),
          output: convertedValue.toFixed(6)
        })
      }
    }
  })
  
  batchResults.value = results
}

// 复制批量结果
const copyBatchResults = () => {
  const text = batchResults.value.map(r => `${r.input} → ${r.output}`).join('\n')
  navigator.clipboard.writeText(text)
  alert('批量转换结果已复制到剪贴板')
}

// 导出批量结果
const exportBatchResults = () => {
  const text = batchResults.value.map(r => `${r.input} → ${r.output}`).join('\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `batch-conversion-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 复制结果
const copyResult = () => {
  if (outputValue.value) {
    navigator.clipboard.writeText(outputValue.value)
    alert('结果已复制到剪贴板')
  }
}

// 添加到收藏
const addToFavorites = () => {
  if (!inputValue.value || !fromUnit.value || !toUnit.value) {
    alert('请先进行转换')
    return
  }
  
  const favoriteItem = {
    type: selectedType.value,
    fromUnit: fromUnit.value,
    toUnit: toUnit.value,
    timestamp: new Date().toISOString()
  }
  
  // 检查是否已存在
  const exists = favorites.value.some(
    f => f.type === favoriteItem.type && 
          f.fromUnit === favoriteItem.fromUnit && 
          f.toUnit === favoriteItem.toUnit
  )
  
  if (!exists) {
    favorites.value.unshift(favoriteItem)
    // 限制收藏数量
    if (favorites.value.length > 20) {
      favorites.value.pop()
    }
    alert('已添加到收藏')
  } else {
    alert('该转换已存在于收藏中')
  }
}

// 从收藏移除
const removeFromFavorites = (index) => {
  favorites.value.splice(index, 1)
  alert('已从收藏移除')
}

// 检查是否已收藏
const isFavorite = () => {
  return favorites.value.some(
    f => f.type === selectedType.value && 
          f.fromUnit === fromUnit.value && 
          f.toUnit === toUnit.value
  )
}

// 使用收藏项
const useFavorite = (item) => {
  selectedType.value = item.type
  fromUnit.value = item.fromUnit
  toUnit.value = item.toUnit
  convert()
}

// 监听历史记录变化，保存到本地存储
watch(history, (newHistory) => {
  localStorage.setItem('unitConversionHistory', JSON.stringify(newHistory))
}, { deep: true })

// 监听自定义单位变化，保存到本地存储
watch(customUnits, (newUnits) => {
  localStorage.setItem('customUnits', JSON.stringify(newUnits))
}, { deep: true })

// 监听收藏变化，保存到本地存储
watch(favorites, (newFavorites) => {
  localStorage.setItem('unitConversionFavorites', JSON.stringify(newFavorites))
}, { deep: true })

// 从本地存储加载数据
onMounted(() => {
  const savedHistory = localStorage.getItem('unitConversionHistory')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory)
  }
  
  const savedCustomUnits = localStorage.getItem('customUnits')
  if (savedCustomUnits) {
    customUnits.value = JSON.parse(savedCustomUnits)
  }
  
  const savedFavorites = localStorage.getItem('unitConversionFavorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
  
  initUnits()
})
</script>

<style scoped>
.unit-converter-page {
  min-height: 100vh;
  display: flex;
  background: var(--color-bg-primary);
}

.converter-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  width: 220px;
  background: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-header {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section h3 {
  margin: 0 0 0.375rem 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  text-align: left;
}

.nav-item:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-primary);
}

.nav-item.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: 500;
}

.nav-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.history-toggle {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 内容区域样式 */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.converter-container {
  max-width: 800px;
  margin: 0 auto;
}

.converter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.converter-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

.converter-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: var(--color-primary-hover);
}

.action-btn .icon {
  font-size: 0.9375rem;
}

/* 转换输入区域 */
.conversion-input-area {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
}

.input-group {
  margin-bottom: 0.75rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.main-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.15s ease;
}

.main-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.unit-selector-group {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
}

.unit-selector {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.unit-selector label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.unit-select {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-bg-primary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.unit-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.swap-button {
  padding: 0.5rem 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swap-button:hover {
  background: var(--color-primary-hover);
}

/* 转换结果展示 */
.conversion-result {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
}

.result-main {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  justify-content: center;
}

.result-value {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  font-family: 'Courier New', monospace;
}

.result-unit {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.result-formula {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.formula-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.formula-text {
  font-size: 0.875rem;
  color: white;
  font-family: 'Courier New', monospace;
}

/* 常用转换快捷方式 */
.quick-conversions {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.quick-conversions h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
}

.quick-conversion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-conversion-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-conversion-btn:hover {
  background: #e9ecef;
  border-color: #667eea;
  transform: translateY(-2px);
}

.quick-from,
.quick-to {
  font-weight: 600;
  color: #2c3e50;
}

.quick-arrow {
  color: #6c757d;
  font-size: 1.2rem;
}

/* 历史记录面板 */
.history-panel,
.custom-panel,
.batch-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
}

.panel-actions {
  display: flex;
  gap: 0.75rem;
}

.panel-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.panel-btn:hover {
  background: #495057;
}

.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: #f8f9fa;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.history-type {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
}

.history-conversion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #2c3e50;
  font-family: 'Courier New', monospace;
}

.history-arrow {
  color: #6c757d;
}

.history-value {
  font-weight: 600;
}

.history-unit {
  color: #6c757d;
  font-size: 0.9rem;
}

.history-time {
  font-size: 0.8rem;
  color: #95a5a6;
}

.history-delete {
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-delete:hover {
  background: #b02a37;
}

.empty-history {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-style: italic;
}

/* 自定义单位表单 */
.custom-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.custom-units-list {
  margin-top: 1rem;
}

.custom-units-list h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.custom-units {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.custom-unit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.custom-unit-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.unit-name {
  font-weight: 600;
  color: #2c3e50;
}

.unit-factor {
  font-size: 0.85rem;
  color: #6c757d;
}

.unit-symbol {
  font-size: 0.85rem;
  color: #95a5a6;
}

.custom-unit-delete {
  padding: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-unit-delete:hover {
  background: #b02a37;
}

/* 批量转换 */
.batch-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* 收藏面板 */
.favorites-panel {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
}

.favorites-panel h2 {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  color: var(--color-text-primary);
}

.favorites-list {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.75rem;
}

.empty-favorites {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.15s ease;
}

.favorite-item:hover {
  background: var(--color-bg-secondary);
}

.favorite-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.favorite-type {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.favorite-conversion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
}

.favorite-unit {
  color: var(--color-text-primary);
  font-weight: 500;
}

.favorite-arrow {
  color: var(--color-text-muted);
}

.favorite-time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.favorite-actions {
  display: flex;
  gap: 0.5rem;
}

.use-favorite-btn {
  padding: 0.375rem 0.75rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.use-favorite-btn:hover {
  background: var(--color-primary-hover);
}

.remove-favorite-btn {
  padding: 0.375rem 0.75rem;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.remove-favorite-btn:hover {
  background: var(--color-danger-hover);
}

.batch-results {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.batch-results h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.batch-results-list {
  max-height: 400px;
  overflow-y: auto;
}

.batch-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.batch-input {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #2c3e50;
}

.batch-arrow {
  color: #6c757d;
  font-size: 1.2rem;
}

.batch-output {
  font-weight: 600;
  color: #667eea;
}

.batch-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .converter-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .main-content {
    padding: 1.5rem;
  }
  
  .converter-container {
    max-width: 100%;
  }
  
  .quick-conversion-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .sidebar-header h2 {
    font-size: 1.25rem;
  }
  
  .converter-header h2 {
    font-size: 1.5rem;
  }
  
  .result-value {
    font-size: 2rem;
  }
  
  .unit-selector-group {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .swap-button {
    width: 100%;
  }
  
  .quick-conversion-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}
</style>