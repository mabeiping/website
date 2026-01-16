<template>
  <div class="password-manager-page">
    <h1 class="page-title">密码管理器</h1>
    
    <div class="manager-container">
      <div class="search-section">
        <h3>搜索密码</h3>
        <div class="search-input-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索密码..."
            class="search-input"
          />
          <button class="add-button" @click="showAddModal">
            ➕ 添加密码
          </button>
        </div>
      </div>
      
      <div class="password-list">
        <div 
          v-for="(password, index) in filteredPasswords" 
          :key="index"
          class="password-item"
        >
          <div class="password-info" @click="togglePasswordVisibility(index)">
            <div class="password-header">
              <span class="password-name">{{ password.name }}</span>
              <span class="password-username">{{ password.username }}</span>
            </div>
            <div class="password-value">
              <span v-if="!password.visible" class="masked-password">
                ••••••••••
              </span>
              <span v-else class="unmasked-password">
                {{ password.password }}
              </span>
            </div>
          </div>
          <div class="password-actions">
            <button class="copy-button" @click="copyPassword(password.password)">
              📋
            </button>
            <button class="edit-button" @click="editPassword(index)">
              ✏️
            </button>
            <button class="delete-button" @click="deletePassword(index)">
              🗑️
            </button>
          </div>
        </div>
        
        <div v-if="filteredPasswords.length === 0" class="empty-state">
          <p>暂无密码记录</p>
          <p>点击"添加密码"开始使用</p>
        </div>
      </div>
      
      <div class="stats-section">
        <h3>统计信息</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">🔐</span>
            <div class="stat-info">
              <span class="stat-label">总密码数</span>
              <span class="stat-value">{{ passwords.length }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🔒</span>
            <div class="stat-info">
              <span class="stat-label">弱密码</span>
              <span class="stat-value">{{ weakPasswords }}</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🔓</span>
            <div class="stat-info">
              <span class="stat-label">强密码</span>
              <span class="stat-value">{{ strongPasswords }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button class="export-button" @click="exportData">
          📤 导出数据
        </button>
        <button class="import-button" @click="importData">
          📥 导入数据
        </button>
        <button class="clear-button" @click="clearAll">
          🗑️ 清空全部
        </button>
      </div>
    </div>
    
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ editingIndex >= 0 ? '编辑密码' : '添加密码' }}</h3>
        <div class="modal-form">
          <div class="form-group">
            <label class="form-label">名称</label>
            <input 
              type="text" 
              v-model="formData.name" 
              placeholder="如：Google账号"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              type="text" 
              v-model="formData.username" 
              placeholder="用户名或邮箱"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="password-input-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="formData.password" 
                placeholder="输入密码"
                class="form-input password-input"
              />
              <button class="toggle-password-button" @click="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">密码强度</label>
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="strengthClass"
                  :style="{ width: passwordStrength + '%' }"
                ></div>
              </div>
              <span class="strength-text">{{ strengthText }}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea 
              v-model="formData.note" 
              placeholder="可选备注信息"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-button" @click="closeModal">
            取消
          </button>
          <button class="save-button" @click="savePassword" :disabled="!formData.name || !formData.password">
            保存
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个安全的密码管理工具，帮助你管理所有账号密码。</p>
      <ul>
        <li>支持添加、编辑、删除密码记录</li>
        <li>密码强度检测，提示弱密码</li>
        <li>密码隐藏/显示，保护隐私</li>
        <li>一键复制密码，方便使用</li>
        <li>搜索功能，快速查找密码</li>
        <li>支持导出/导入数据，备份恢复</li>
        <li>统计概览，了解密码安全状况</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const passwords = ref([
  { 
    name: 'Google', 
    username: 'example@gmail.com', 
    password: 'password123',
    visible: false,
    note: '主要邮箱账号'
  }
])
const searchQuery = ref('')
const showModal = ref(false)
const editingIndex = ref(-1)
const showPassword = ref(false)
const formData = ref({
  name: '',
  username: '',
  password: '',
  note: ''
})

const filteredPasswords = computed(() => {
  if (!searchQuery.value) return passwords.value
  const query = searchQuery.value.toLowerCase()
  return passwords.value.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.username.toLowerCase().includes(query)
  )
})

const passwordStrength = computed(() => {
  const pwd = formData.value.password
  if (!pwd) return 0
  
  let strength = 0
  if (pwd.length >= 8) strength += 25
  if (pwd.length >= 12) strength += 25
  if (/[A-Z]/.test(pwd)) strength += 15
  if (/[a-z]/.test(pwd)) strength += 15
  if (/[0-9]/.test(pwd)) strength += 15
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 20
  
  return Math.min(strength, 100)
})

const strengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'weak'
  if (strength < 60) return 'medium'
  if (strength < 80) return 'good'
  return 'strong'
})

const strengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return '弱'
  if (strength < 60) return '中等'
  if (strength < 80) return '良好'
  return '强'
})

const weakPasswords = computed(() => {
  return passwords.value.filter(p => {
    const pwd = p.password
    return pwd.length < 8 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)
  }).length
})

const strongPasswords = computed(() => {
  return passwords.value.filter(p => {
    const pwd = p.password
    return pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)
  }).length
})

const showAddModal = () => {
  editingIndex.value = -1
  formData.value = { name: '', username: '', password: '', note: '' }
  showModal.value = true
}

const editPassword = (index) => {
  editingIndex.value = index
  const password = passwords.value[index]
  formData.value = { ...password }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  showPassword.value = false
}

const savePassword = () => {
  if (!formData.value.name || !formData.value.password) return
  
  const newPassword = {
    name: formData.value.name,
    username: formData.value.username,
    password: formData.value.password,
    visible: false,
    note: formData.value.note
  }
  
  if (editingIndex.value >= 0) {
    passwords.value[editingIndex.value] = newPassword
  } else {
    passwords.value.push(newPassword)
  }
  
  closeModal()
}

const deletePassword = (index) => {
  if (confirm('确定要删除这个密码吗？')) {
    passwords.value.splice(index, 1)
  }
}

const togglePasswordVisibility = (index) => {
  passwords.value[index].visible = !passwords.value[index].visible
}

const copyPassword = async (password) => {
  try {
    await navigator.clipboard.writeText(password)
    alert('密码已复制到剪贴板')
  } catch (err) {
    alert('复制失败')
  }
}

const exportData = () => {
  const data = passwords.value.map(p => ({
    name: p.name,
    username: p.username,
    password: p.password,
    note: p.note
  }))
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `passwords-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        passwords.value = data.map(p => ({
          name: p.name,
          username: p.username,
          password: p.password,
          visible: false,
          note: p.note || ''
        }))
        alert('导入成功')
      } catch (err) {
        alert('导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

const clearAll = () => {
  if (confirm('确定要清空所有密码吗？此操作不可恢复！')) {
    passwords.value = []
  }
}
</script>

<style scoped>
.password-manager-page {
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

.manager-container {
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

.search-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-button {
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

.add-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.password-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.password-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.password-item:hover {
  box-shadow: var(--shadow-sm);
  border-color: var(--color-primary);
}

.password-info {
  flex: 1;
  cursor: pointer;
}

.password-header {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.password-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.password-username {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.password-value {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.8rem;
  color: var(--color-text-primary);
}

.masked-password {
  letter-spacing: 1px;
}

.unmasked-password {
  word-break: break-all;
}

.password-actions {
  display: flex;
  gap: 0.25rem;
}

.copy-button,
.edit-button,
.delete-button {
  padding: 0.3rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background-color: var(--color-bg-tertiary);
}

.edit-button:hover {
  background-color: var(--color-bg-tertiary);
}

.delete-button:hover {
  background-color: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-state p {
  margin: 0.3rem 0;
  font-size: 0.875rem;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: 1rem;
  color: var(--color-primary);
  font-weight: 700;
}

.action-section {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.export-button,
.import-button,
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

.import-button {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.import-button:hover {
  background-color: var(--color-bg-quaternary);
}

.clear-button {
  background-color: var(--color-danger);
  color: white;
}

.clear-button:hover {
  background-color: var(--color-danger-hover);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.25rem;
  max-width: 450px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.form-input,
.form-textarea {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-input-group {
  display: flex;
  gap: 0.5rem;
}

.password-input {
  flex: 1;
}

.toggle-password-button {
  padding: 0.3rem;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.toggle-password-button:hover {
  background-color: var(--color-bg-tertiary);
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background-color: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background-color: var(--color-danger);
}

.strength-fill.medium {
  background-color: #F59E0B;
}

.strength-fill.good {
  background-color: #10B981;
}

.strength-fill.strong {
  background-color: #3B82F6;
}

.strength-text {
  font-weight: 600;
  font-size: 0.75rem;
}

.strength-text.weak {
  color: var(--color-danger);
}

.strength-text.medium {
  color: #F59E0B;
}

.strength-text.good {
  color: #10B981;
}

.strength-text.strong {
  color: #3B82F6;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.75rem;
}

.cancel-button,
.save-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.cancel-button:hover {
  background-color: var(--color-bg-quaternary);
}

.save-button {
  background-color: var(--color-primary);
  color: white;
}

.save-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .password-manager-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .manager-container {
    padding: 1.5rem;
  }

  .search-input-group {
    flex-direction: column;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }

  .export-button,
  .import-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }

  .password-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .password-info {
    width: 100%;
  }
}
</style>
