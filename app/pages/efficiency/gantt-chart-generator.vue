<template>
  <div class="gantt-chart-generator-page">
    <h1 class="page-title">甘特图生成器</h1>
    
    <div class="generator-container">
      <div class="task-section">
        <h3>任务列表</h3>
        <div class="task-list">
          <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <div class="task-inputs">
              <input 
                type="text" 
                v-model="task.name" 
                placeholder="任务名称"
                class="task-name-input"
              />
              <input 
                type="date" 
                v-model="task.startDate" 
                class="task-date-input"
              />
              <input 
                type="date" 
                v-model="task.endDate" 
                class="task-date-input"
              />
              <input 
                type="text" 
                v-model="task.progress" 
                placeholder="进度%"
                class="task-progress-input"
              />
              <button class="remove-task-button" @click="removeTask(index)">✕</button>
            </div>
          </div>
          <button class="add-task-button" @click="addTask">
            ➕ 添加任务
          </button>
        </div>
      </div>
      
      <div class="options-section">
        <h3>图表选项</h3>
        <div class="option-group">
          <label class="option-label">图表标题</label>
          <input 
            type="text" 
            v-model="chartTitle" 
            placeholder="输入图表标题"
            class="option-input"
          />
        </div>
        
        <div class="option-group">
          <label class="option-label">显示选项</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="showDates" />
              显示日期
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="showProgress" />
              显示进度
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="showMilestones" />
              显示里程碑
            </label>
          </div>
        </div>
        
        <div class="option-group">
          <label class="option-label">颜色主题</label>
          <div class="color-options">
            <label 
              v-for="theme in colorThemes" 
              :key="theme.value"
              class="color-option"
              :class="{ active: selectedTheme === theme.value }"
            >
              <input 
                type="radio" 
                v-model="selectedTheme" 
                :value="theme.value"
                name="colorTheme"
              />
              <span class="color-preview" :style="{ backgroundColor: theme.color }"></span>
              <span class="color-name">{{ theme.name }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button class="generate-button" @click="generateChart" :disabled="tasks.length === 0">
          📊 生成甘特图
        </button>
        <button class="clear-button" @click="clearAll">
          🗑️ 清空
        </button>
      </div>
      
      <div v-if="chartGenerated" class="chart-preview-section">
        <h3>图表预览</h3>
        <div class="chart-preview" ref="chartContainer">
          <div class="gantt-chart">
            <div class="chart-header">
              <h4>{{ chartTitle || '项目甘特图' }}</h4>
            </div>
            <div class="chart-body">
              <div class="timeline-header">
                <div v-for="date in dateRange" :key="date" class="timeline-date">
                  {{ formatDate(date) }}
                </div>
              </div>
              <div v-for="(task, index) in tasks" :key="index" class="task-row">
                <div class="task-name">{{ task.name }}</div>
                <div class="task-bar-container">
                  <div 
                    class="task-bar" 
                    :style="getTaskBarStyle(task)"
                  >
                    <div class="task-progress" :style="{ width: task.progress + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="export-buttons">
          <button class="export-button" @click="exportAsImage">
            🖼️ 导出为图片
          </button>
          <button class="export-button" @click="exportAsPdf">
            📕 导出为PDF
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的甘特图生成器，用于项目管理和进度跟踪。</p>
      <ul>
        <li>支持添加多个任务，设置起止日期和进度</li>
        <li>可自定义图表标题和显示选项</li>
        <li>支持多种颜色主题</li>
        <li>实时预览甘特图效果</li>
        <li>支持导出为图片或PDF格式</li>
        <li>直观展示项目进度和时间安排</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tasks = ref([
  { name: '', startDate: '', endDate: '', progress: 0 }
])
const chartTitle = ref('')
const showDates = ref(true)
const showProgress = ref(true)
const showMilestones = ref(false)
const selectedTheme = ref('blue')
const chartGenerated = ref(false)

const colorThemes = [
  { value: 'blue', name: '蓝色', color: '#3B82F6' },
  { value: 'green', name: '绿色', color: '#10B981' },
  { value: 'purple', name: '紫色', color: '#8B5CF6' },
  { value: 'orange', name: '橙色', color: '#F59E0B' }
]

const dateRange = computed(() => {
  if (tasks.value.length === 0) return []
  
  const allDates = tasks.value.flatMap(task => {
    const dates = []
    if (task.startDate) dates.push(new Date(task.startDate))
    if (task.endDate) dates.push(new Date(task.endDate))
    return dates
  })
  
  if (allDates.length === 0) return []
  
  const minDate = new Date(Math.min(...allDates))
  const maxDate = new Date(Math.max(...allDates))
  
  const dates = []
  const current = new Date(minDate)
  while (current <= maxDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return dates.map(d => d.toISOString().split('T')[0])
})

const addTask = () => {
  tasks.value.push({ name: '', startDate: '', endDate: '', progress: 0 })
}

const removeTask = (index) => {
  tasks.value.splice(index, 1)
}

const getTaskBarStyle = (task) => {
  if (!task.startDate || !task.endDate) return {}
  
  const start = new Date(task.startDate)
  const end = new Date(task.endDate)
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  
  const theme = colorThemes.find(t => t.value === selectedTheme.value)
  const backgroundColor = theme ? theme.color : '#3B82F6'
  
  return {
    width: `${totalDays * 40}px`,
    backgroundColor
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

const generateChart = () => {
  if (tasks.value.length === 0) {
    alert('请先添加任务')
    return
  }
  
  chartGenerated.value = true
}

const exportAsImage = () => {
  alert('导出图片功能需要后端支持')
}

const exportAsPdf = () => {
  alert('导出PDF功能需要后端支持')
}

const clearAll = () => {
  tasks.value = [{ name: '', startDate: '', endDate: '', progress: 0 }]
  chartTitle.value = ''
  chartGenerated.value = false
}
</script>

<style scoped>
.gantt-chart-generator-page {
  max-width: 1600px;
  width: 95%;
  margin: 0 auto;
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
}

.generator-container {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.task-item {
  padding: 0.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.task-inputs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.task-name-input {
  flex: 2;
  padding: 0.4rem 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.task-name-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-date-input {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.task-date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-progress-input {
  width: 60px;
  padding: 0.4rem 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.task-progress-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.remove-task-button {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.2rem;
  transition: all 0.2s ease;
}

.remove-task-button:hover {
  transform: scale(1.1);
}

.add-task-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.add-task-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.options-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.option-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.option-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.option-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: flex;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-label input {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.color-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
}

.color-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.color-option.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.color-option input {
  display: none;
}

.color-preview {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

.color-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.75rem;
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.generate-button,
.clear-button {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.generate-button {
  background-color: var(--color-primary);
  color: white;
}

.generate-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.clear-button:hover {
  background-color: var(--color-bg-quaternary);
}

.chart-preview-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-preview-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-preview {
  padding: 2rem;
  background-color: var(--color-bg-primary);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

.gantt-chart {
  min-width: 800px;
}

.chart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.chart-header h4 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-header {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.timeline-date {
  min-width: 40px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.task-name {
  min-width: 150px;
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.task-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
}

.task-bar {
  height: 30px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.task-progress {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  top: 0;
  left: 0;
}

.export-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.export-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.export-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
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
  .gantt-chart-generator-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .generator-container {
    padding: 1.5rem;
  }

  .task-inputs {
    flex-direction: column;
    align-items: stretch;
  }

  .task-name-input,
  .task-date-input,
  .task-progress-input {
    width: 100%;
  }

  .color-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .generate-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }

  .export-buttons {
    flex-direction: column;
  }

  .export-button {
    width: 100%;
  }
}
</style>
