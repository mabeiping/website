<template>
  <div class="pomodoro-timer-page">
    <h1 class="page-title">番茄工作法计时器</h1>
    
    <div class="pomodoro-timer-container">
      <!-- 计时器主体 -->
      <div class="timer-main">
        <div class="timer-display">
          <div class="timer-mode-indicator">{{ currentMode === 'work' ? '工作时间' : '休息时间' }}</div>
          <div class="timer-circle" :class="{ 'active': isRunning }">
            <div class="timer-text">
              <div class="timer-time">{{ formattedTime }}</div>
              <div class="timer-progress" :style="{ '--progress': progressPercentage + '%' }"></div>
            </div>
          </div>
        </div>
        
        <!-- 控制按钮 -->
        <div class="timer-controls">
          <button 
            class="control-btn primary" 
            @click="toggleTimer"
          >
            {{ isRunning ? '暂停' : '开始' }}
          </button>
          <button 
            class="control-btn secondary" 
            @click="resetTimer"
          >
            重置
          </button>
        </div>
        
        <!-- 模式切换 -->
        <div class="mode-selector">
          <button 
            class="mode-btn" 
            :class="{ active: currentMode === 'work' }" 
            @click="switchMode('work')"
          >
            工作
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: currentMode === 'shortBreak' }" 
            @click="switchMode('shortBreak')"
          >
            短休息
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: currentMode === 'longBreak' }" 
            @click="switchMode('longBreak')"
          >
            长休息
          </button>
        </div>
      </div>
      
      <!-- 设置面板 -->
      <div class="settings-panel">
        <h2>设置</h2>
        
        <!-- 时间设置 -->
        <div class="setting-group">
          <h3>时间设置</h3>
          
          <div class="setting-item">
            <label for="workDuration">工作时间 (分钟)：</label>
            <input 
              type="number" 
              id="workDuration" 
              v-model.number="workDuration"
              @change="updateTimer"
              min="1" 
              max="120"
            >
          </div>
          
          <div class="setting-item">
            <label for="shortBreakDuration">短休息时间 (分钟)：</label>
            <input 
              type="number" 
              id="shortBreakDuration" 
              v-model.number="shortBreakDuration"
              @change="updateTimer"
              min="1" 
              max="30"
            >
          </div>
          
          <div class="setting-item">
            <label for="longBreakDuration">长休息时间 (分钟)：</label>
            <input 
              type="number" 
              id="longBreakDuration" 
              v-model.number="longBreakDuration"
              @change="updateTimer"
              min="1" 
              max="60"
            >
          </div>
          
          <div class="setting-item">
            <label for="workCycles">工作周期数：</label>
            <input 
              type="number" 
              id="workCycles" 
              v-model.number="workCycles"
              min="1" 
              max="10"
            >
          </div>
        </div>
        
        <!-- 音效设置 -->
        <div class="setting-group">
          <h3>音效设置</h3>
          
          <div class="setting-item">
            <label for="soundEnabled">启用音效：</label>
            <input 
              type="checkbox" 
              id="soundEnabled" 
              v-model="soundEnabled"
            >
          </div>
          
          <div class="setting-item">
            <label for="soundVolume">音量：</label>
            <input 
              type="range" 
              id="soundVolume" 
              v-model.number="soundVolume"
              min="0" 
              max="100" 
              step="5"
            >
            <span class="volume-value">{{ soundVolume }}%</span>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="stats-group">
          <h3>今日统计</h3>
          
          <div class="stat-item">
            <span class="stat-label">完成番茄数：</span>
            <span class="stat-value">{{ completedPomodoros }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">工作时长：</span>
            <span class="stat-value">{{ formattedTotalWorkTime }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能说明 -->
    <div class="pomodoro-timer-info">
      <h2>功能说明</h2>
      <p>番茄工作法是一种时间管理方法，通过将工作时间划分为25分钟的工作周期和短暂的休息时间，帮助提高工作效率。</p>
      <ul>
        <li>工作时间：默认25分钟，专注工作</li>
        <li>短休息：默认5分钟，短暂休息放松</li>
        <li>长休息：默认15分钟，每4个工作周期后进行一次长休息</li>
        <li>自动切换：工作时间结束后自动进入休息时间，休息时间结束后自动进入工作时间</li>
        <li>统计功能：记录今日完成的番茄数和总工作时长</li>
        <li>可自定义时间设置和音效</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 计时器状态
const isRunning = ref(false)
const currentMode = ref('work')
const timeLeft = ref(25 * 60) // 默认25分钟
let timerInterval = null

// 设置
const workDuration = ref(25)
const shortBreakDuration = ref(5)
const longBreakDuration = ref(15)
const workCycles = ref(4)
const soundEnabled = ref(true)
const soundVolume = ref(50)

// 统计
const completedPomodoros = ref(0)
const totalWorkTime = ref(0)

// 格式化时间
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 格式化总工作时间
const formattedTotalWorkTime = computed(() => {
  const hours = Math.floor(totalWorkTime.value / 60)
  const minutes = totalWorkTime.value % 60
  return `${hours}小时${minutes}分钟`
})

// 计算进度百分比
const progressPercentage = computed(() => {
  const totalTime = getTotalTimeForMode()
  return ((totalTime - timeLeft.value) / totalTime) * 100
})

// 获取当前模式的总时间
const getTotalTimeForMode = () => {
  switch (currentMode.value) {
    case 'work': return workDuration.value * 60
    case 'shortBreak': return shortBreakDuration.value * 60
    case 'longBreak': return longBreakDuration.value * 60
    default: return 25 * 60
  }
}

// 切换计时器
const toggleTimer = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    startTimer()
  } else {
    stopTimer()
  }
}

// 开始计时器
const startTimer = () => {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        if (currentMode.value === 'work') {
          totalWorkTime.value++
        }
      } else {
        handleTimerComplete()
      }
    }, 1000)
  }
}

// 停止计时器
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 重置计时器
const resetTimer = () => {
  stopTimer()
  isRunning.value = false
  timeLeft.value = getTotalTimeForMode()
}

// 更新计时器
const updateTimer = () => {
  if (!isRunning.value) {
    timeLeft.value = getTotalTimeForMode()
  }
}

// 切换模式
const switchMode = (mode) => {
  currentMode.value = mode
  resetTimer()
}

// 处理计时器完成
const handleTimerComplete = () => {
  stopTimer()
  isRunning.value = false
  
  // 播放提示音
  if (soundEnabled.value) {
    // 模拟音效
    console.log('播放提示音')
  }
  
  // 切换模式
  if (currentMode.value === 'work') {
    completedPomodoros.value++
    // 判断是短休息还是长休息
    if (completedPomodoros.value % workCycles.value === 0) {
      switchMode('longBreak')
    } else {
      switchMode('shortBreak')
    }
  } else {
    switchMode('work')
  }
  
  // 自动开始下一个周期
  setTimeout(() => {
    toggleTimer()
  }, 2000)
}

// 初始化
onMounted(() => {
  // 加载保存的设置（模拟）
  timeLeft.value = getTotalTimeForMode()
})

// 组件销毁前清理
onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped>
.pomodoro-timer-page {
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

.pomodoro-timer-container {
  display: flex;
  gap: 2rem;
}

.timer-main {
  flex: 1;
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.timer-display {
  text-align: center;
  margin-bottom: 2rem;
}

.timer-mode-indicator {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  font-weight: 500;
}

.timer-circle {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border: 4px solid var(--color-border);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timer-circle.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2);
}

.timer-text {
  text-align: center;
}

.timer-time {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.timer-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary) var(--progress), var(--color-bg-secondary) var(--progress));
  border-radius: 0 0 4px 4px;
  transition: width 1s linear;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.control-btn {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn.primary {
  background-color: var(--color-primary);
  color: white;
}

.control-btn.primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.control-btn.secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.control-btn.secondary:hover {
  background-color: var(--color-bg-quaternary);
}

.mode-selector {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.mode-btn {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.mode-btn:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
}

.mode-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.settings-panel {
  flex: 1;
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.settings-panel h2 {
  margin: 0 0 1.5rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-group h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setting-item label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
  flex: 1;
}

.setting-item input[type="number"] {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 80px;
}

.setting-item input[type="number"]:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.setting-item input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
  cursor: pointer;
}

.setting-item input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  outline: none;
}

.setting-item input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.volume-value {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
  min-width: 40px;
}

.stats-group {
  margin-bottom: 2rem;
}

.stats-group h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.stat-value {
  font-weight: 700;
  color: var(--color-primary);
  font-size: 1.1rem;
}

.pomodoro-timer-info {
  background-color: var(--color-bg-card);
  border-radius: 10px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.pomodoro-timer-info h2 {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.pomodoro-timer-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.pomodoro-timer-info ul {
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-left: 1.5rem;
  margin: 0;
}

.pomodoro-timer-info ul li {
  margin-bottom: 0.5rem;
}
</style>
