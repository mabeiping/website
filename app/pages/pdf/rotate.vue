<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF旋转</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">🔄</div>
            <div class="upload-text">
              <p>点击选择PDF文件</p>
              <p class="upload-hint">支持PDF格式，最大10MB</p>
            </div>
          </label>
        </div>
        
        <div v-if="selectedFile" class="file-info">
          <p>已选择文件: {{ selectedFile.name }}</p>
          <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
        </div>
      </div>
      
      <div class="rotate-options">
        <h3>旋转设置</h3>
        <div class="rotate-settings">
          <div class="rotate-scope">
            <label>旋转范围:</label>
            <div class="scope-options">
              <label class="radio-label">
                <input type="radio" v-model="rotateScope" value="all" />
                <span>全部页面</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="rotateScope" value="selected" />
                <span>指定页面</span>
              </label>
            </div>
          </div>
          
          <div v-if="rotateScope === 'selected'" class="pages-input">
            <label>页码范围（例如：1, 3-5, 8）:</label>
            <input 
              type="text" 
              v-model="pageNumbers" 
              placeholder="1, 3-5, 8"
              class="text-input"
            />
          </div>
          
          <div class="rotate-angle">
            <label>旋转角度:</label>
            <div class="angle-buttons">
              <button 
                v-for="angle in angles" 
                :key="angle.value"
                class="angle-button"
                :class="{ active: selectedAngle === angle.value }"
                @click="selectedAngle = angle.value"
              >
                {{ angle.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleRotate" :disabled="!selectedFile || (rotateScope === 'selected' && !pageNumbers)">
          开始旋转
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="rotateResult" class="result-area">
        <h3>旋转结果</h3>
        <div class="result-message">
          <p>{{ rotateResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF旋转工具可以旋转PDF文件的页面方向。</p>
      <ul>
        <li>支持旋转全部页面或指定页面</li>
        <li>支持90度、180度、270度旋转</li>
        <li>可自定义页码范围</li>
        <li>旋转后可直接下载</li>
      </ul>
      <div class="notice">
        <p><strong>注意：</strong>此功能需要后端服务器支持。当前为前端演示界面。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const rotateScope = ref('all')
const pageNumbers = ref('')
const selectedAngle = ref(90)
const rotateResult = ref('')

const angles = [
  { value: 90, label: '90° 顺时针' },
  { value: 180, label: '180°' },
  { value: 270, label: '270° 顺时针' }
]

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB')
      return
    }
    selectedFile.value = file
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleRotate = () => {
  if (!selectedFile.value) {
    alert('请选择PDF文件')
    return
  }
  
  if (rotateScope.value === 'selected' && !pageNumbers.value) {
    alert('请输入页码范围')
    return
  }
  
  // 这里应该是实际的旋转逻辑，需要后端支持
  const scopeText = rotateScope.value === 'all' ? '全部页面' : `页面 ${pageNumbers.value}`
  const angleText = angles.find(a => a.value === selectedAngle.value)?.label || `${selectedAngle.value}°`
  rotateResult.value = `已将 "${selectedFile.value.name}" 的 ${scopeText} 旋转 ${angleText}（演示模式）`
}

const reset = () => {
  selectedFile.value = null
  rotateScope.value = 'all'
  pageNumbers.value = ''
  selectedAngle.value = 90
  rotateResult.value = ''
  document.getElementById('pdf-file').value = ''
}
</script>

<style scoped>
.pdf-tool-page {
  max-width: 900px;
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

.upload-area {
  margin-bottom: 2rem;
}

.upload-box {
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-box:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.upload-label {
  cursor: pointer;
  display: block;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text p {
  margin: 0.5rem 0;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.file-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
}

.file-info p {
  margin: 0.5rem 0;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.rotate-options {
  margin-bottom: 2rem;
}

.rotate-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.rotate-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rotate-scope label,
.rotate-angle label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.scope-options {
  display: flex;
  gap: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.radio-label:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.radio-label input[type="radio"]:checked + span {
  color: var(--color-primary);
  font-weight: 600;
}

.pages-input {
  margin-top: 0.5rem;
}

.pages-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.angle-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.angle-button {
  flex: 1;
  min-width: 120px;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.angle-button:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.angle-button.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}

.action-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-button {
  flex: 1;
  padding: 1rem 2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.action-button.secondary:hover {
  background-color: var(--color-gray-300);
}

.result-area {
  padding: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.result-area h3 {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.result-message {
  color: var(--color-text-secondary);
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

.tool-info p {
  color: var(--color-text-secondary);
  line-height: 1.6;
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

.notice {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(245, 158, 11, 0.1);
  border-left: 4px solid var(--color-accent);
  border-radius: 4px;
}

.notice p {
  margin: 0;
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .pdf-tool-page {
    padding: 1rem;
  }
  
  .action-area {
    flex-direction: column;
  }
  
  .angle-buttons {
    flex-direction: column;
  }
  
  .angle-button {
    width: 100%;
  }
}
</style>