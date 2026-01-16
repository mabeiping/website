<template>
  <div class="text-comparison-page">
    <h1 class="page-title">文本比较工具</h1>
    
    <div class="comparison-container">
      <div class="text-input-area">
        <div class="text-input">
          <div class="input-header">
            <h3>原始文本</h3>
            <button class="clear-button" @click="clearLeft">清除</button>
          </div>
          <textarea 
            v-model="leftText" 
            @input="compareTexts"
            placeholder="在此输入原始文本..."
            rows="15"
          ></textarea>
        </div>
        
        <div class="comparison-result">
          <div class="result-stats">
            <div class="stat-item">
              <span class="stat-label">添加:</span>
              <span class="stat-value added">{{ addedCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">删除:</span>
              <span class="stat-value deleted">{{ deletedCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">修改:</span>
              <span class="stat-value modified">{{ modifiedCount }}</span>
            </div>
          </div>
          <div class="comparison-actions">
            <button class="action-button" @click="compareTexts">比较文本</button>
            <button class="action-button" @click="swapTexts">交换文本</button>
            <button class="action-button" @click="clearAll">清除全部</button>
          </div>
        </div>
        
        <div class="text-input">
          <div class="input-header">
            <h3>修改后文本</h3>
            <button class="clear-button" @click="clearRight">清除</button>
          </div>
          <textarea 
            v-model="rightText" 
            @input="compareTexts"
            placeholder="在此输入修改后文本..."
            rows="15"
          ></textarea>
        </div>
      </div>
      
      <div class="comparison-output" v-if="showComparison">
        <h3>比较结果</h3>
        <div class="diff-viewer">
          <div 
            v-for="(line, index) in diffLines" 
            :key="index"
            :class="['diff-line', line.type]"
          >
            <span class="line-number">{{ line.lineNumber }}</span>
            <span class="line-content">{{ line.content }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="comparison-info">
      <h2>功能说明</h2>
      <p>这是一个文本比较工具，可以高亮显示两个文本之间的差异。</p>
      <ul>
        <li>支持比较两个文本的添加、删除和修改内容</li>
        <li>实时显示比较结果，高亮差异部分</li>
        <li>提供统计信息，显示添加、删除和修改的行数</li>
        <li>支持交换左右文本和清除文本</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const leftText = ref('')
const rightText = ref('')

const diffLines = ref([])
const addedCount = ref(0)
const deletedCount = ref(0)
const modifiedCount = ref(0)
const showComparison = ref(false)

const clearLeft = () => {
  leftText.value = ''
  compareTexts()
}

const clearRight = () => {
  rightText.value = ''
  compareTexts()
}

const clearAll = () => {
  leftText.value = ''
  rightText.value = ''
  compareTexts()
}

const swapTexts = () => {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
  compareTexts()
}

const compareTexts = () => {
  if (!leftText.value || !rightText.value) {
    diffLines.value = []
    addedCount.value = 0
    deletedCount.value = 0
    modifiedCount.value = 0
    showComparison.value = false
    return
  }
  
  const leftLines = leftText.value.split('\n')
  const rightLines = rightText.value.split('\n')
  
  const diff = []
  let added = 0
  let deleted = 0
  let modified = 0
  
  const maxLines = Math.max(leftLines.length, rightLines.length)
  
  for (let i = 0; i < maxLines; i++) {
    const left = leftLines[i] || ''
    const right = rightLines[i] || ''
    
    if (left === right) {
      diff.push({
        lineNumber: i + 1,
        content: left,
        type: 'same'
      })
    } else if (!left && right) {
      diff.push({
        lineNumber: i + 1,
        content: right,
        type: 'added'
      })
      added++
    } else if (left && !right) {
      diff.push({
        lineNumber: i + 1,
        content: left,
        type: 'deleted'
      })
      deleted++
    } else {
      diff.push({
        lineNumber: i + 1,
        content: right,
        type: 'modified'
      })
      modified++
    }
  }
  
  diffLines.value = diff
  addedCount.value = added
  deletedCount.value = deleted
  modifiedCount.value = modified
  showComparison.value = true
}
</script>

<style scoped>
@import '../../styles/TextComparison.css';
</style>
