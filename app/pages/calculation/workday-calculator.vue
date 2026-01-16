<template>
  <div class="workday-calculator-page">
    <h1 class="page-title">工作日/节假日计算器</h1>
    
    <div class="tool-container">
      <div class="calculator-section">
        <div class="calc-mode">
          <h3>计算模式</h3>
          <div class="mode-options">
            <label class="radio-option">
              <input type="radio" v-model="calcMode" value="count" />
              <span>计算工作日天数</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="calcMode" value="project" />
              <span>推算项目截止日期</span>
            </label>
          </div>
        </div>
        
        <div v-if="calcMode === 'count'" class="date-range-section">
          <h3>日期范围</h3>
          <div class="date-inputs">
            <div class="date-input-group">
              <label>开始日期：</label>
              <input v-model="startDate" type="date" class="date-input" @change="calculateWorkdays" />
            </div>
            <div class="date-input-group">
              <label>结束日期：</label>
              <input v-model="endDate" type="date" class="date-input" @change="calculateWorkdays" />
            </div>
          </div>
          <div v-if="workdayResult" class="result-display">
            <div class="result-item">
              <span class="result-label">工作日天数：</span>
              <span class="result-value highlight">{{ workdayResult.workdays }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">总天数：</span>
              <span class="result-value">{{ workdayResult.totalDays }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">周末天数：</span>
              <span class="result-value">{{ workdayResult.weekends }} 天</span>
            </div>
            <div class="result-item" v-if="workdayResult.holidays > 0">
              <span class="result-label">节假日天数：</span>
              <span class="result-value">{{ workdayResult.holidays }} 天</span>
            </div>
          </div>
        </div>
        
        <div v-if="calcMode === 'project'" class="project-section">
          <h3>项目信息</h3>
          <div class="project-inputs">
            <div class="date-input-group">
              <label>开始日期：</label>
              <input v-model="projectStartDate" type="date" class="date-input" @change="calculateProjectEnd" />
            </div>
            <div class="date-input-group">
              <label>工作日数：</label>
              <input v-model.number="projectWorkdays" type="number" class="number-input" min="1" @input="calculateProjectEnd" />
            </div>
          </div>
          <div v-if="projectEndDate" class="result-display">
            <div class="result-item">
              <span class="result-label">预计截止日期：</span>
              <span class="result-value highlight">{{ projectEndDate }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="holiday-section">
        <div class="section-header">
          <h3>节假日设置</h3>
          <button class="btn-secondary" @click="addHoliday">添加节假日</button>
        </div>
        <div class="holiday-list">
          <div v-for="(holiday, index) in holidays" :key="index" class="holiday-item">
            <input v-model="holiday.date" type="date" class="date-input-small" @change="updateHolidays" />
            <input v-model="holiday.name" type="text" class="text-input-small" placeholder="节假日名称" @input="updateHolidays" />
            <button class="remove-btn" @click="removeHoliday(index)">删除</button>
          </div>
          <div v-if="holidays.length === 0" class="empty-holidays">
            暂无节假日，点击"添加节假日"添加
          </div>
        </div>
        <div class="preset-holidays">
          <h4>预设节假日（2026年）</h4>
          <div class="preset-buttons">
            <button class="preset-btn" @click="loadPresetHolidays">加载2026年法定节假日</button>
            <button class="preset-btn" @click="clearHolidays">清空所有</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <ul>
        <li>工作日计算：输入起止日期，自动计算工作日天数</li>
        <li>自定义节假日：手动标记补班日/放假日</li>
        <li>工期推算：输入总工作日数，自动推算项目截止日期</li>
        <li>自动排除周末：自动排除周六和周日</li>
        <li>支持预设节假日：快速加载法定节假日</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const calcMode = ref('count')
const startDate = ref('')
const endDate = ref('')
const workdayResult = ref(null)
const projectStartDate = ref('')
const projectWorkdays = ref(0)
const projectEndDate = ref('')
const holidays = ref([])

// 2026年法定节假日（示例）
const presetHolidays2026 = [
  { date: '2026-01-01', name: '元旦' },
  { date: '2026-01-28', name: '春节' },
  { date: '2026-01-29', name: '春节' },
  { date: '2026-01-30', name: '春节' },
  { date: '2026-01-31', name: '春节' },
  { date: '2026-02-01', name: '春节' },
  { date: '2026-02-02', name: '春节' },
  { date: '2026-04-05', name: '清明节' },
  { date: '2026-05-01', name: '劳动节' },
  { date: '2026-05-02', name: '劳动节' },
  { date: '2026-05-03', name: '劳动节' },
  { date: '2026-06-10', name: '端午节' },
  { date: '2026-09-15', name: '中秋节' },
  { date: '2026-09-16', name: '中秋节' },
  { date: '2026-09-17', name: '中秋节' },
  { date: '2026-10-01', name: '国庆节' },
  { date: '2026-10-02', name: '国庆节' },
  { date: '2026-10-03', name: '国庆节' },
  { date: '2026-10-04', name: '国庆节' },
  { date: '2026-10-05', name: '国庆节' },
  { date: '2026-10-06', name: '国庆节' },
  { date: '2026-10-07', name: '国庆节' }
]

const isWeekend = (date) => {
  const day = date.getDay()
  return day === 0 || day === 6 // 0是周日，6是周六
}

const isHoliday = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return holidays.value.some(h => h.date === dateStr)
}

const calculateWorkdays = () => {
  if (!startDate.value || !endDate.value) {
    workdayResult.value = null
    return
  }
  
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  
  if (start > end) {
    alert('开始日期不能晚于结束日期')
    return
  }
  
  let workdays = 0
  let weekends = 0
  let holidayCount = 0
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  
  const current = new Date(start)
  while (current <= end) {
    if (isHoliday(current)) {
      holidayCount++
    } else if (isWeekend(current)) {
      weekends++
    } else {
      workdays++
    }
    current.setDate(current.getDate() + 1)
  }
  
  workdayResult.value = {
    workdays,
    totalDays,
    weekends,
    holidays: holidayCount
  }
}

const calculateProjectEnd = () => {
  if (!projectStartDate.value || !projectWorkdays.value || projectWorkdays.value <= 0) {
    projectEndDate.value = ''
    return
  }
  
  const start = new Date(projectStartDate.value)
  let count = 0
  const current = new Date(start)
  
  while (count < projectWorkdays.value) {
    if (!isWeekend(current) && !isHoliday(current)) {
      count++
    }
    if (count < projectWorkdays.value) {
      current.setDate(current.getDate() + 1)
    }
  }
  
  const year = current.getFullYear()
  const month = String(current.getMonth() + 1).padStart(2, '0')
  const day = String(current.getDate()).padStart(2, '0')
  projectEndDate.value = `${year}-${month}-${day}`
}

const addHoliday = () => {
  holidays.value.push({ date: '', name: '' })
}

const removeHoliday = (index) => {
  holidays.value.splice(index, 1)
  updateHolidays()
}

const updateHolidays = () => {
  if (calcMode.value === 'count') {
    calculateWorkdays()
  } else {
    calculateProjectEnd()
  }
}

const loadPresetHolidays = () => {
  holidays.value = [...presetHolidays2026]
  updateHolidays()
}

const clearHolidays = () => {
  holidays.value = []
  updateHolidays()
}

watch([calcMode, startDate, endDate, projectStartDate, projectWorkdays], () => {
  if (calcMode.value === 'count') {
    calculateWorkdays()
  } else {
    calculateProjectEnd()
  }
})
</script>

<style scoped>
.workday-calculator-page {
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

.calculator-section {
  margin-bottom: 2rem;
}

.calc-mode {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.calc-mode h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.mode-options {
  display: flex;
  gap: 1.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.2s ease;
}

.radio-option:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-tertiary);
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-option input[type="radio"]:checked + span {
  color: var(--color-primary);
  font-weight: 600;
}

.date-range-section,
.project-section {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.date-range-section h3,
.project-section h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.date-inputs,
.project-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-input-group label {
  min-width: 100px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.date-input,
.number-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.date-input:focus,
.number-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.result-display {
  padding: 1.5rem;
  background-color: var(--color-bg-primary);
  border-radius: 8px;
  border: 2px solid var(--color-primary);
}

.result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.result-item:last-child {
  border-bottom: none;
}

.result-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 120px;
}

.result-value {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 1.1rem;
}

.result-value.highlight {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.3rem;
}

.holiday-section {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.holiday-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.holiday-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.date-input-small,
.text-input-small {
  padding: 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.date-input-small {
  width: 150px;
}

.text-input-small {
  flex: 1;
}

.remove-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background-color: var(--color-danger-hover);
}

.empty-holidays {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-secondary);
  background-color: var(--color-bg-primary);
  border-radius: 6px;
}

.preset-holidays {
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.preset-holidays h4 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.preset-buttons {
  display: flex;
  gap: 0.75rem;
}

.preset-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background-color: var(--color-primary-hover);
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
  .workday-calculator-page {
    padding: 1rem;
  }
  
  .mode-options {
    flex-direction: column;
  }
  
  .date-input-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .holiday-item {
    flex-wrap: wrap;
  }
}
</style>