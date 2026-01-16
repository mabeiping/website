<template>
  <div class="habit-tracker-page">
    <h1 class="page-title">习惯追踪器</h1>
    
    <div class="tracker-container">
      <div class="habit-section">
        <h3>习惯列表</h3>
        <div class="habit-list">
          <div v-for="(habit, index) in habits" :key="index" class="habit-item">
            <div class="habit-info">
              <div class="habit-header">
                <input 
                  type="text" 
                  v-model="habit.name" 
                  placeholder="习惯名称"
                  class="habit-name-input"
                />
                <button class="remove-habit-button" @click="removeHabit(index)">✕</button>
              </div>
              <div class="habit-stats">
                <div class="stat-item">
                  <span class="stat-label">连续天数:</span>
                  <span class="stat-value">{{ habit.streak }} 天</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">完成率:</span>
                  <span class="stat-value">{{ habit.completionRate }}%</span>
                </div>
              </div>
            </div>
            <div class="habit-calendar">
              <div 
                v-for="(day, dayIndex) in getDaysInMonth()" 
                :key="dayIndex"
                class="calendar-day"
                :class="{ 
                  completed: isHabitCompleted(habit, day),
                  today: isToday(day)
                }"
                @click="toggleHabitCompletion(habit, day)"
              >
                {{ day.getDate() }}
              </div>
            </div>
          </div>
          <button class="add-habit-button" @click="addHabit">
            ➕ 添加习惯
          </button>
        </div>
      </div>
      
      <div class="options-section">
        <h3>统计概览</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">📊</span>
            <div class="stat-info">
              <span class="stat-label">总习惯数</span>
              <span class="stat-value">{{ habits.length }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🔥</span>
            <div class="stat-info">
              <span class="stat-label">最长连续</span>
              <span class="stat-value">{{ longestStreak }} 天</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div class="stat-info">
              <span class="stat-label">今日完成</span>
              <span class="stat-value">{{ todayCompleted }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📈</span>
            <div class="stat-info">
              <span class="stat-label">本月完成</span>
              <span class="stat-value">{{ monthlyCompleted }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button class="export-button" @click="exportData">
          📤 导出数据
        </button>
        <button class="clear-button" @click="clearAll">
          🗑️ 清空
        </button>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的习惯追踪器，帮助你建立和保持良好的习惯。</p>
      <ul>
        <li>支持添加多个习惯，自定义习惯名称</li>
        <li>日历视图，直观展示每日完成情况</li>
        <li>自动计算连续天数和完成率</li>
        <li>统计概览，全面了解习惯养成情况</li>
        <li>支持导出数据，备份习惯记录</li>
        <li>点击日历格子即可标记完成</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const habits = ref([
  { 
    name: '早起', 
    streak: 5, 
    completionRate: 85,
    completedDates: []
  }
])
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const getDaysInMonth = () => {
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  const days = []
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentYear.value, currentMonth.value, i))
  }
  return days
}

const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

const isHabitCompleted = (habit, date) => {
  const dateStr = date.toISOString().split('T')[0]
  return habit.completedDates.includes(dateStr)
}

const toggleHabitCompletion = (habit, date) => {
  const dateStr = date.toISOString().split('T')[0]
  const index = habit.completedDates.indexOf(dateStr)
  
  if (index > -1) {
    habit.completedDates.splice(index, 1)
  } else {
    habit.completedDates.push(dateStr)
  }
  
  updateHabitStats(habit)
}

const updateHabitStats = (habit) => {
  habit.streak = calculateStreak(habit.completedDates)
  habit.completionRate = calculateCompletionRate(habit.completedDates)
}

const calculateStreak = (completedDates) => {
  if (completedDates.length === 0) return 0
  
  const sortedDates = [...completedDates].sort().reverse()
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i])
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (date.toDateString() === expectedDate.toDateString()) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

const calculateCompletionRate = (completedDates) => {
  const totalDays = getDaysInMonth().length
  if (totalDays === 0) return 0
  return Math.round((completedDates.length / totalDays) * 100)
}

const addHabit = () => {
  habits.value.push({ 
    name: '', 
    streak: 0, 
    completionRate: 0,
    completedDates: []
  })
}

const removeHabit = (index) => {
  habits.value.splice(index, 1)
}

const longestStreak = computed(() => {
  if (habits.value.length === 0) return 0
  return Math.max(...habits.value.map(h => h.streak))
})

const todayCompleted = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return habits.value.filter(h => h.completedDates.includes(today)).length
})

const monthlyCompleted = computed(() => {
  return habits.value.reduce((total, habit) => total + habit.completedDates.length, 0)
})

const exportData = () => {
  const data = habits.value.map(h => ({
    name: h.name,
    streak: h.streak,
    completionRate: h.completionRate,
    completedDates: h.completedDates
  }))
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `habits-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const clearAll = () => {
  habits.value = [{ 
    name: '', 
    streak: 0, 
    completionRate: 0,
    completedDates: []
  }]
}
</script>

<style scoped>
.habit-tracker-page {
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

.tracker-container {
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

.habit-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.habit-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.habit-item {
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.habit-name-input {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.habit-name-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.remove-habit-button {
  background: none;
  border: none;
  color: var(--color-danger);
  cursor: pointer;
  font-size: 1rem;
  padding: 0.3rem;
  transition: all 0.2s ease;
}

.remove-habit-button:hover {
  transform: scale(1.1);
}

.habit-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 0.95rem;
  color: var(--color-primary);
  font-weight: 700;
}

.habit-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.calendar-day:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.calendar-day.completed {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.calendar-day.today {
  border-color: var(--color-primary);
  border-width: 2px;
}

.add-habit-button {
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

.add-habit-button:hover {
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.action-section {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.export-button,
.clear-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.export-button {
  background-color: var(--color-primary);
  color: white;
}

.export-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.clear-button {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.clear-button:hover {
  background-color: var(--color-bg-quaternary);
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
  .habit-tracker-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .tracker-container {
    padding: 1.5rem;
  }

  .habit-calendar {
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
  }

  .calendar-day {
    font-size: 0.8rem;
  }

  .habit-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .export-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
