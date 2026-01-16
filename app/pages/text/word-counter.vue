<template>
  <div class="word-counter-page">
    <h1 class="page-title">字数统计工具</h1>
    
    <div class="counter-container">
      <div class="text-input-area">
        <textarea 
          v-model="inputText" 
          @input="countWords"
          placeholder="在此输入文本..."
          rows="15"
        ></textarea>
        <div class="text-actions">
          <button class="action-button" @click="clearText">清除文本</button>
          <button class="action-button" @click="copyStats">复制统计</button>
        </div>
      </div>
      
      <div class="stats-area">
        <h3>统计结果</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">字符数（含空格）</div>
            <div class="stat-value">{{ stats.charactersWithSpaces }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">字符数（不含空格）</div>
            <div class="stat-value">{{ stats.charactersWithoutSpaces }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">字数</div>
            <div class="stat-value">{{ stats.words }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">单词数</div>
            <div class="stat-value">{{ stats.englishWords }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">行数</div>
            <div class="stat-value">{{ stats.lines }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">段落数</div>
            <div class="stat-value">{{ stats.paragraphs }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">句子数</div>
            <div class="stat-value">{{ stats.sentences }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">平均词长</div>
            <div class="stat-value">{{ stats.averageWordLength.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="counter-info">
      <h2>功能说明</h2>
      <p>这是一个功能齐全的字数统计工具，可以统计文本的多种指标。</p>
      <ul>
        <li>支持统计字符数（含空格和不含空格）</li>
        <li>支持统计字数、单词数、行数和段落数</li>
        <li>支持统计句子数和平均词长</li>
        <li>实时统计，输入文本后立即显示结果</li>
        <li>支持清除文本和复制统计结果</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputText = ref('')

const stats = computed(() => {
  const text = inputText.value
  
  const charactersWithSpaces = text.length
  const charactersWithoutSpaces = text.replace(/\s/g, '').length
  const lines = text ? text.split('\n').length : 0
  const paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const chineseWords = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length
  const words = chineseWords + englishWords
  const sentences = (text.match(/[。！？；.!?]/g) || []).length
  const totalCharacters = charactersWithoutSpaces
  const totalWords = words
  const averageWordLength = totalWords > 0 ? totalCharacters / totalWords : 0
  
  return {
    charactersWithSpaces,
    charactersWithoutSpaces,
    words,
    englishWords,
    lines,
    paragraphs,
    sentences,
    averageWordLength
  }
})

const countWords = () => {
}

const clearText = () => {
  inputText.value = ''
}

const copyStats = () => {
  const statsText = `字符数（含空格）: ${stats.value.charactersWithSpaces}\n字符数（不含空格）: ${stats.value.charactersWithoutSpaces}\n字数: ${stats.value.words}\n单词数: ${stats.value.englishWords}\n行数: ${stats.value.lines}\n段落数: ${stats.value.paragraphs}\n句子数: ${stats.value.sentences}\n平均词长: ${stats.value.averageWordLength.toFixed(2)}`
  
  navigator.clipboard.writeText(statsText).then(() => {
    alert('统计结果已复制到剪贴板')
  }).catch(err => {
    console.error('复制失败:', err)
  })
}
</script>

<style scoped>
@import './WordCounter.css';
</style>
