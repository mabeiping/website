<template>
  <div class="qrcode-barcode-generator-page">
    <h1 class="page-title">二维码/条形码生成器</h1>
    
    <div class="generator-container">
      <div class="type-section">
        <h3>生成类型</h3>
        <div class="type-options">
          <label 
            class="type-option"
            :class="{ active: generateType === 'qrcode' }"
          >
            <input type="radio" v-model="generateType" value="qrcode" name="generateType" />
            <span class="type-icon">📱</span>
            <span class="type-name">二维码</span>
          </label>
          <label 
            class="type-option"
            :class="{ active: generateType === 'barcode' }"
          >
            <input type="radio" v-model="generateType" value="barcode" name="generateType" />
            <span class="type-icon">📊</span>
            <span class="type-name">条形码</span>
          </label>
        </div>
      </div>
      
      <div class="input-section">
        <h3>输入内容</h3>
        <div class="input-group">
          <label class="input-label">文本内容</label>
          <input 
            type="text" 
            v-model="inputText" 
            placeholder="输入要生成的文本或URL"
            class="text-input"
            @input="generateCode"
          />
        </div>
        
        <div v-if="generateType === 'barcode'" class="input-group">
          <label class="input-label">条形码格式</label>
          <select v-model="barcodeFormat" class="select-input" @change="generateCode">
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
            <option value="EAN13">EAN13</option>
            <option value="EAN8">EAN8</option>
            <option value="UPC">UPC</option>
          </select>
        </div>
        
        <div class="options-grid">
          <div class="option-item">
            <label class="option-label">宽度</label>
            <input 
              type="number" 
              v-model.number="width" 
              min="100" 
              max="500"
              class="number-input"
              @input="generateCode"
            />
          </div>
          <div class="option-item">
            <label class="option-label">高度</label>
            <input 
              type="number" 
              v-model.number="height" 
              min="100" 
              max="500"
              class="number-input"
              @input="generateCode"
            />
          </div>
          <div class="option-item">
            <label class="option-label">前景色</label>
            <input 
              type="color" 
              v-model="foregroundColor" 
              class="color-input"
              @input="generateCode"
            />
          </div>
          <div class="option-item">
            <label class="option-label">背景色</label>
            <input 
              type="color" 
              v-model="backgroundColor" 
              class="color-input"
              @input="generateCode"
            />
          </div>
        </div>
        
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showText" />
            显示文本
          </label>
        </div>
      </div>
      
      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-container">
          <div class="code-preview">
            <canvas ref="canvasRef" class="code-canvas"></canvas>
            <div v-if="showText && inputText" class="code-text">
              {{ inputText }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <button class="generate-button" @click="generateCode" :disabled="!inputText">
          🔄 重新生成
        </button>
        <button class="download-button" @click="downloadCode" :disabled="!codeGenerated">
          ⬇️ 下载
        </button>
        <button class="clear-button" @click="clearAll">
          🗑️ 清空
        </button>
      </div>
      
      <div class="presets-section">
        <h3>快速模板</h3>
        <div class="preset-grid">
          <button 
            v-for="(preset, index) in presets" 
            :key="index"
            class="preset-button"
            @click="applyPreset(preset)"
          >
            {{ preset.name }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>功能说明</h2>
      <p>这是一个功能强大的二维码/条形码生成器，支持多种格式和自定义选项。</p>
      <ul>
        <li>支持二维码和条形码两种类型</li>
        <li>支持多种条形码格式（CODE128, CODE39, EAN13, EAN8, UPC）</li>
        <li>可自定义尺寸、颜色、文本显示</li>
        <li>实时预览生成效果</li>
        <li>支持下载为PNG格式</li>
        <li>提供常用快速模板</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const generateType = ref('qrcode')
const inputText = ref('')
const barcodeFormat = ref('CODE128')
const width = ref(200)
const height = ref(200)
const foregroundColor = ref('#000000')
const backgroundColor = ref('#FFFFFF')
const showText = ref(false)
const codeGenerated = ref(false)
const canvasRef = ref(null)

const presets = [
  { name: '网站URL', text: 'https://example.com', type: 'qrcode' },
  { name: 'WiFi网络', text: 'WIFI:T:WPA;S:MyNetwork;P:password;;', type: 'qrcode' },
  { name: '联系方式', text: 'TEL:1234567890', type: 'qrcode' },
  { name: '商品编码', text: '1234567890123', type: 'barcode' },
  { name: 'ISBN', text: '978-3-16-148410-0', type: 'barcode' }
]

const generateCode = async () => {
  if (!inputText.value) return
  
  codeGenerated.value = false
  
  if (generateType.value === 'qrcode') {
    await generateQRCode()
  } else {
    await generateBarcode()
  }
}

const generateQRCode = async () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  canvas.width = width.value
  canvas.height = height.value
  
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  try {
    const QRCode = await import('qrcode')
    const qr = new QRCode.default()
    
    await new Promise((resolve, reject) => {
      qr.make({
        value: inputText.value,
        size: Math.min(width.value, height.value),
        margin: 1,
        color: {
          dark: foregroundColor.value,
          light: backgroundColor.value
        }
      }, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
    
    const img = qr.createImgTag()
    const size = Math.min(width.value, height.value) - 2
    const offset = (canvas.width - size) / 2
    
    ctx.drawImage(img, offset, offset, size, size)
    
    if (showText.value) {
      ctx.fillStyle = foregroundColor.value
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(inputText.value, canvas.width / 2, canvas.height - 20)
    }
    
    codeGenerated.value = true
  } catch (err) {
    console.error('QR Code generation failed:', err)
    alert('生成失败，请重试')
  }
}

const generateBarcode = () => {
  if (!canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  canvas.width = width.value
  canvas.height = height.value
  
  ctx.fillStyle = backgroundColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  try {
    const JsBarcode = require('jsbarcode')
    
    JsBarcode(canvas, inputText.value, {
      format: barcodeFormat.value,
      lineColor: foregroundColor.value,
      width: width.value,
      height: height.value,
      displayValue: showText.value
    })
    
    codeGenerated.value = true
  } catch (err) {
    console.error('Barcode generation failed:', err)
    alert('生成失败，请重试')
  }
}

const downloadCode = () => {
  if (!canvasRef.value || !codeGenerated.value) return
  
  const canvas = canvasRef.value
  const link = document.createElement('a')
  link.download = `${generateType.value}-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const applyPreset = (preset) => {
  inputText.value = preset.text
  generateType.value = preset.type
  generateCode()
}

const clearAll = () => {
  inputText.value = ''
  codeGenerated.value = false
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

onMounted(() => {
  if (canvasRef.value) {
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
})
</script>

<style scoped>
.qrcode-barcode-generator-page {
  max-width: 1120px;
  width: 76%;
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

.type-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.type-options {
  display: flex;
  gap: 0.5rem;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.35rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--color-bg-primary);
  flex: 1;
}

.type-option:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.type-option.active {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.1);
}

.type-option input {
  display: none;
}

.type-icon {
  font-size: 1.2rem;
}

.type-name {
  font-weight: 400;
  color: var(--color-text-primary);
  font-size: 0.75rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-label {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.text-input,
.select-input,
.number-input,
.color-input {
  padding: 0.3rem 0.5rem;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.text-input:focus,
.select-input:focus,
.number-input:focus,
.color-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-input {
  width: 70px;
  height: 32px;
  padding: 0.15rem;
  cursor: pointer;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.3rem;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.checkbox-group {
  display: flex;
  gap: 0.3rem;
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

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.preview-container {
  display: flex;
  justify-content: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.code-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.code-canvas {
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background-color: white;
  max-width: 100%;
}

.code-text {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.8rem;
  color: var(--color-text-primary);
  text-align: center;
  padding: 0.3rem;
  background-color: var(--color-bg-primary);
  border-radius: 4px;
}

.action-section {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.generate-button,
.download-button,
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

.generate-button {
  background-color: var(--color-primary);
  color: white;
}

.generate-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-button {
  background-color: var(--color-primary);
  color: white;
}

.download-button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.download-button:disabled {
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

.presets-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.presets-section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.preset-button {
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.preset-button:hover {
  border-color: var(--color-primary);
  background-color: rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

.info-section {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.info-section h2 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.info-section p {
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.info-section ul {
  color: var(--color-text-secondary);
  line-height: 1.6;
  padding-left: 1.25rem;
  margin: 0;
  font-size: 0.875rem;
}

.info-section ul li {
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .qrcode-barcode-generator-page {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .generator-container {
    padding: 1.5rem;
  }

  .type-options {
    flex-direction: column;
  }

  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .action-section {
    flex-direction: column;
  }

  .generate-button,
  .download-button,
  .clear-button {
    width: 100%;
    justify-content: center;
  }

  .preset-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
