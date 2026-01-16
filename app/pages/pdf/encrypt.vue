<template>
  <div class="pdf-tool-page">
    <h1 class="page-title">PDF加密</h1>
    
    <div class="tool-container">
      <div class="upload-area">
        <div class="upload-box">
          <input type="file" id="pdf-file" accept=".pdf" @change="handleFileSelect" style="display: none;">
          <label for="pdf-file" class="upload-label">
            <div class="upload-icon">🔒</div>
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
      
      <div class="encrypt-options">
        <h3>加密设置</h3>
        <div class="encrypt-settings">
          <div class="password-input">
            <label for="open-password">打开密码:</label>
            <input 
              type="password" 
              id="open-password"
              v-model="openPassword" 
              placeholder="设置打开PDF所需的密码"
              class="text-input"
            />
            <p class="input-hint">设置后，打开PDF文件需要输入此密码</p>
          </div>
          
          <div class="password-input">
            <label for="edit-password">编辑密码（可选）:</label>
            <input 
              type="password" 
              id="edit-password"
              v-model="editPassword" 
              placeholder="设置编辑PDF所需的密码"
              class="text-input"
            />
            <p class="input-hint">设置后，编辑PDF文件需要输入此密码</p>
          </div>
          
          <div class="permission-options">
            <label>权限设置:</label>
            <div class="permissions">
              <label class="checkbox-label">
                <input type="checkbox" v-model="permissions.print" />
                <span>允许打印</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="permissions.copy" />
                <span>允许复制</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="permissions.modify" />
                <span>允许修改</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-area">
        <button class="action-button" @click="handleEncrypt" :disabled="!selectedFile || !openPassword">
          开始加密
        </button>
        <button class="action-button secondary" @click="reset">重置</button>
      </div>
      
      <div v-if="encryptResult" class="result-area">
        <h3>加密结果</h3>
        <div class="result-message">
          <p>{{ encryptResult }}</p>
        </div>
      </div>
    </div>
    
    <div class="tool-info">
      <h2>功能说明</h2>
      <p>PDF加密工具可以为PDF文件添加密码保护，防止未授权访问和编辑。</p>
      <ul>
        <li>支持设置打开密码和编辑密码</li>
        <li>可自定义权限设置（打印、复制、修改）</li>
        <li>加密后文件更安全</li>
        <li>加密后可直接下载</li>
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
const openPassword = ref('')
const editPassword = ref('')
const permissions = ref({
  print: true,
  copy: true,
  modify: true
})
const encryptResult = ref('')

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

const handleEncrypt = () => {
  if (!selectedFile.value) {
    alert('请选择PDF文件')
    return
  }
  
  if (!openPassword.value) {
    alert('请设置打开密码')
    return
  }
  
  // 这里应该是实际的加密逻辑，需要后端支持
  encryptResult.value = `文件 "${selectedFile.value.name}" 已加密（演示模式）`
}

const reset = () => {
  selectedFile.value = null
  openPassword.value = ''
  editPassword.value = ''
  permissions.value = {
    print: true,
    copy: true,
    modify: true
  }
  encryptResult.value = ''
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

.encrypt-options {
  margin-bottom: 2rem;
}

.encrypt-options h3 {
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.encrypt-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.password-input label {
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

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.permission-options label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.permissions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  border-color: var(--color-primary);
  background-color: var(--color-bg-secondary);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
}
</style>