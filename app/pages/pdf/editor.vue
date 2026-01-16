<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF编辑</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">✏️</div>
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
      
      <div class="edit-options">
        <h3>编辑功能</h3>
        <div class="edit-features">
          <div class="feature-section">
            <h4>文本编辑</h4>
            <div class="feature-buttons">
              <button class="feature-button" @click="showFeature('addText')">添加文本</button>
              <button class="feature-button" @click="showFeature('editText')">编辑文本</button>
              <button class="feature-button" @click="showFeature('deleteText')">删除文本</button>
            </div>
          </div>
          
          <div class="feature-section">
            <h4>页面操作</h4>
            <div class="feature-buttons">
              <button class="feature-button" @click="showFeature('addPage')">添加页面</button>
              <button class="feature-button" @click="showFeature('deletePage')">删除页面</button>
              <button class="feature-button" @click="showFeature('reorderPage')">重新排序</button>
            </div>
          </div>
          
          <div class="feature-section">
            <h4>图形编辑</h4>
            <div class="feature-buttons">
              <button class="feature-button" @click="showFeature('addImage')">添加图片</button>
              <button class="feature-button" @click="showFeature('addShape')">添加形状</button>
              <button class="feature-button" @click="showFeature('addAnnotation')">添加注释</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleSave" :disabled="!selectedFile">
          保存编辑
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="editResult" class="result-area">
        <h3>编辑结果</h3>
        <div class="result-message">
          <p>{{ editResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF编辑工具可以对PDF文件进行各种编辑操作。</p>
      <ul>
        <li>支持添加、编辑、删除文本</li>
        <li>支持添加、删除、重新排序页面</li>
        <li>支持添加图片、形状、注释</li>
        <li>编辑后可直接保存下载</li>
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
const editResult = ref('')

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

const showFeature = (feature) => {
  if (!selectedFile.value) {
    alert('请先选择PDF文件')
    return
  }
  
  const featureNames = {
    addText: '添加文本',
    editText: '编辑文本',
    deleteText: '删除文本',
    addPage: '添加页面',
    deletePage: '删除页面',
    reorderPage: '重新排序',
    addImage: '添加图片',
    addShape: '添加形状',
    addAnnotation: '添加注释'
  }
  
  alert(`"${featureNames[feature]}" 功能需要后端服务器支持（演示模式）`)
}

const handleSave = () => {
  if (!selectedFile.value) {
    alert('请选择PDF文件')
    return
  }
  
  // 这里应该是实际的保存逻辑，需要后端支持
  editResult.value = `文件 "${selectedFile.value.name}" 的编辑已保存（演示模式）`
}

const reset = () => {
  selectedFile.value = null
  editResult.value = ''
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

.edit-options {
  margin-bottom: 2rem;
}

.edit-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.edit-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-section {
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
}

.feature-section h4 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 0.75rem;
}

.feature-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.feature-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.feature-button:hover {
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
  
  .feature-buttons {
    flex-direction: column;
  }
  
  .feature-button {
    width: 100%;
  }
}
</style>