<template>
  <div class="meeting-notes-page">
    <h1 class="page-title">会议记录工具</h1>
    <p class="page-description">在线记录会议内容，支持实时编辑和分享</p>
    
    <div class="meeting-notes-content">
      <!-- 会议基本信息 -->
      <div class="meeting-info">
        <div class="form-row">
          <div class="form-group">
            <label for="meeting-title">会议标题</label>
            <input type="text" id="meeting-title" v-model="meetingInfo.title" placeholder="请输入会议标题">
          </div>
          <div class="form-group">
            <label for="meeting-date">会议日期</label>
            <input type="date" id="meeting-date" v-model="meetingInfo.date">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="meeting-time">会议时间</label>
            <input type="time" id="meeting-time" v-model="meetingInfo.time">
          </div>
          <div class="form-group">
            <label for="meeting-location">会议地点</label>
            <input type="text" id="meeting-location" v-model="meetingInfo.location" placeholder="请输入会议地点">
          </div>
        </div>
        <div class="form-group">
          <label for="meeting-attendees">参会人员</label>
          <input type="text" id="meeting-attendees" v-model="meetingInfo.attendees" placeholder="请输入参会人员，用逗号分隔">
        </div>
        <div class="form-group">
          <label for="meeting-host">会议主持人</label>
          <input type="text" id="meeting-host" v-model="meetingInfo.host" placeholder="请输入会议主持人">
        </div>
      </div>
      
      <!-- 会议内容 -->
      <div class="meeting-content">
        <div class="form-group">
          <label for="meeting-agenda">会议议程</label>
          <textarea id="meeting-agenda" v-model="meetingInfo.agenda" placeholder="请输入会议议程" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="meeting-discussion">会议讨论内容</label>
          <textarea id="meeting-discussion" v-model="meetingInfo.discussion" placeholder="请输入会议讨论内容" rows="6"></textarea>
        </div>
        <div class="form-group">
          <label for="meeting-decisions">会议决议</label>
          <textarea id="meeting-decisions" v-model="meetingInfo.decisions" placeholder="请输入会议决议" rows="4"></textarea>
        </div>
        <div class="form-group">
          <label for="meeting-actions">行动项</label>
          <textarea id="meeting-actions" v-model="meetingInfo.actions" placeholder="请输入行动项，每项一行" rows="4"></textarea>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="btn btn-primary" @click="saveMeetingNotes">保存会议记录</button>
        <button class="btn btn-secondary" @click="clearMeetingNotes">清空</button>
        <button class="btn btn-secondary" @click="exportMeetingNotes">导出</button>
      </div>
      
      <!-- 保存记录列表 -->
      <div class="saved-notes" v-if="savedNotes.length > 0">
        <h3>已保存的会议记录</h3>
        <div class="notes-list">
          <div class="note-item" v-for="(note, index) in savedNotes" :key="index">
            <div class="note-header">
              <h4>{{ note.title }}</h4>
              <div class="note-meta">
                <span>{{ note.date }} {{ note.time }}</span>
                <span>{{ note.location }}</span>
              </div>
            </div>
            <div class="note-actions">
              <button class="btn btn-small" @click="loadMeetingNote(index)">加载</button>
              <button class="btn btn-small btn-danger" @click="deleteMeetingNote(index)">删除</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 消息提示 -->
      <div class="message" v-if="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 会议信息数据
const meetingInfo = ref({
  title: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().split(' ')[0].substring(0, 5),
  location: '',
  attendees: '',
  host: '',
  agenda: '',
  discussion: '',
  decisions: '',
  actions: ''
});

// 已保存的会议记录
const savedNotes = ref([]);

// 消息提示
const message = ref('');
const messageType = ref('success');

// 加载本地存储的会议记录
onMounted(() => {
  loadSavedNotes();
});

// 加载已保存的会议记录
const loadSavedNotes = () => {
  try {
    const notes = localStorage.getItem('meetingNotes');
    if (notes) {
      savedNotes.value = JSON.parse(notes);
    }
  } catch (error) {
    showMessage('加载会议记录失败', 'error');
    console.error('加载会议记录失败:', error);
  }
};

// 保存会议记录
const saveMeetingNotes = () => {
  try {
    // 验证必填字段
    if (!meetingInfo.value.title.trim()) {
      showMessage('请输入会议标题', 'error');
      return;
    }
    
    // 添加到已保存列表
    savedNotes.value.push({ ...meetingInfo.value });
    
    // 保存到本地存储
    localStorage.setItem('meetingNotes', JSON.stringify(savedNotes.value));
    
    showMessage('会议记录保存成功', 'success');
  } catch (error) {
    showMessage('保存会议记录失败', 'error');
    console.error('保存会议记录失败:', error);
  }
};

// 加载会议记录
const loadMeetingNote = (index) => {
  try {
    meetingInfo.value = { ...savedNotes.value[index] };
    showMessage('会议记录加载成功', 'success');
  } catch (error) {
    showMessage('加载会议记录失败', 'error');
    console.error('加载会议记录失败:', error);
  }
};

// 删除会议记录
const deleteMeetingNote = (index) => {
  try {
    savedNotes.value.splice(index, 1);
    localStorage.setItem('meetingNotes', JSON.stringify(savedNotes.value));
    showMessage('会议记录删除成功', 'success');
  } catch (error) {
    showMessage('删除会议记录失败', 'error');
    console.error('删除会议记录失败:', error);
  }
};

// 清空会议记录
const clearMeetingNotes = () => {
  if (confirm('确定要清空所有会议记录吗？')) {
    meetingInfo.value = {
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      location: '',
      attendees: '',
      host: '',
      agenda: '',
      discussion: '',
      decisions: '',
      actions: ''
    };
    showMessage('会议记录已清空', 'success');
  }
};

// 导出会议记录
const exportMeetingNotes = () => {
  try {
    // 创建导出内容
    let exportContent = `会议记录\n`;
    exportContent += `====================================\n`;
    exportContent += `会议标题: ${meetingInfo.value.title}\n`;
    exportContent += `会议日期: ${meetingInfo.value.date}\n`;
    exportContent += `会议时间: ${meetingInfo.value.time}\n`;
    exportContent += `会议地点: ${meetingInfo.value.location}\n`;
    exportContent += `参会人员: ${meetingInfo.value.attendees}\n`;
    exportContent += `会议主持人: ${meetingInfo.value.host}\n`;
    exportContent += `\n会议议程:\n${meetingInfo.value.agenda}\n`;
    exportContent += `\n会议讨论内容:\n${meetingInfo.value.discussion}\n`;
    exportContent += `\n会议决议:\n${meetingInfo.value.decisions}\n`;
    exportContent += `\n行动项:\n${meetingInfo.value.actions}\n`;
    
    // 创建下载链接
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingInfo.value.title || '会议记录'}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showMessage('会议记录导出成功', 'success');
  } catch (error) {
    showMessage('导出会议记录失败', 'error');
    console.error('导出会议记录失败:', error);
  }
};

// 显示消息
const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};
</script>

<style scoped>
.meeting-notes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
}

.page-description {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.meeting-notes-content {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.meeting-info {
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.form-group label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.meeting-content {
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background-color: var(--color-bg-quaternary);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-danger {
  background-color: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  background-color: var(--color-danger-hover);
}

.saved-notes {
  margin-top: 2rem;
}

.saved-notes h3 {
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-item {
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-header h4 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  font-weight: 600;
}

.note-meta {
  display: flex;
  gap: 1rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.message {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
}

.message.success {
  background-color: #10B981;
  color: white;
}

.message.error {
  background-color: var(--color-danger);
  color: white;
}
</style>
