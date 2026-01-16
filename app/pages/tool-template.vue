<template>
  <div class="tool-template-page">
    <h1 class="page-title">{{ toolName }}</h1>
    
    <div class="development-notice">
      <div class="notice-icon">🚧</div>
      <div class="notice-content">
        <h2>即将上线</h2>
        <p>该工具正在开发中，敬请期待！</p>
        <div class="notice-details">
          <h3>即将上线功能：</h3>
          <ul>
            <li v-for="(feature, index) in plannedFeatures" :key="index">{{ feature }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="back-home">
      <button class="back-button" @click="goBack">
        <span class="icon">🏠</span> 返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 根据路由获取工具名称
const toolName = computed(() => {
  const path = route.path
  const toolMap = {
    '/text/text-batch-processor': '文本批量处理小工具',
    '/text/date-formatter': '日期格式化工具',
    '/text/regex-tester': '正则表达式测试工具',
    '/text/json-parser': 'JSON解析工具',
    '/format/pdf-toolbox': 'PDF工具箱',
    '/format/office-format-converter': '轻量Office格式转换工具',
    '/format/video-converter': '视频在线转换器',
    '/format/ebook-converter': '电子书转换器',
    '/format/gif-processor': 'GIF文件处理',
    '/image/image-compressor': '图片无损压缩工具',
    '/image/id-photo-processor': '办公证件照快速处理工具',
    '/image/image-batch-processor': '图片批量处理工具',
    '/calculation/workday-calculator': '工作日/节假日计算器',
    '/calculation/timestamp-converter': '时间戳转换工具',
    '/calculation/unit-conversions': '综合单位换算工具',
    '/efficiency/qrcode-barcode-generator': '二维码/条形码生成器',
    '/efficiency/password-manager': '密码生成与管理',
    '/efficiency/habit-tracker': '习惯追踪器',
    '/efficiency/gantt-chart-generator': '项目工期甘特图简易生成器',
    '/material/office-color-icon-library': '办公配色/图标素材库'
  }
  return toolMap[path] || '工具页面'
})

// 计划功能列表
const plannedFeatures = computed(() => {
  const path = route.path
  const featuresMap = {
    '/text/text-batch-processor': ['格式清理：批量去除文本空格、换行符、多余空行', '标点转换：中英文标点互转', '内容提取：从文本中提取手机号、邮箱、网址', '编号生成：补充批量生成连续数字/字母编号'],
    '/text/date-formatter': ['数字格式（20260115）↔ 中文格式（2026年1月15日）', '短横线格式（2026-01-15）↔ 点分隔格式（2026.01.15）', '支持批量粘贴文本批量格式化'],
    '/text/regex-tester': ['正则表达式编写与测试', '实时匹配结果展示', '支持常用正则模板'],
    '/text/json-parser': ['JSON格式化与美化', '语法错误检测', '支持复制格式化结果'],
    '/format/pdf-toolbox': ['合并PDF：上传多个PDF，自定义排序，合并为单个文件', '拆分PDF：按页码拆分或按每页拆分为独立文件', '压缩PDF：按清晰优先/大小优先压缩', '旋转PDF：单页/全部页面旋转', 'PDF加密：设置打开密码/编辑权限密码', '格式转换：Word/Excel/PPT/HTML/TXT/JPG/PNG等与PDF互转'],
    '/format/office-format-converter': ['Word↔PDF：DOC/DOCX与PDF互转', 'Excel↔CSV：XLS/XLSX与CSV格式互转', 'PPT↔图片：PPT/PPTX拆分为单页图片', '支持批量转换'],
    '/format/video-converter': ['AVI转MP4', 'MOV转MP4', 'WMV转MP4', 'WEBM转MP4', 'MP4转MKV', 'MP4转GIF'],
    '/format/ebook-converter': ['支持EPUB、MOBI、TXT、PDF格式互转', '批量上传电子书文件', '转换后保持排版'],
    '/format/gif-processor': ['GIF文件编辑', 'GIF压缩', 'GIF格式转换'],
    '/image/image-compressor': ['支持JPG/PNG压缩', '批量处理（最多10张，单张≤10MB）', '压缩等级：清晰优先（30%）/大小优先（70%）', '无水印，批量打包下载'],
    '/image/id-photo-processor': ['尺寸裁剪：预设一寸/二寸/社保/简历头像等标准尺寸', '背景替换：一键更换红/蓝/白纯色背景', '大小压缩：将照片压缩至指定大小', '实时预览效果，无水印导出JPG'],
    '/image/image-batch-processor': ['批量压缩：同图片无损压缩工具功能', '批量裁剪：按统一尺寸裁剪多张图片', '调整尺寸：自定义宽高，保持比例缩放', '格式转换：批量转换JPG↔PNG↔WebP↔ICO'],
    '/calculation/workday-calculator': ['工作日计算：输入起止日期，自动计算工作日天数', '自定义调休：手动标记补班日/放假日', '工期推算：输入总工作日数，自动推算项目截止日期', '加班工资计算：按法定标准计算加班工资'],
    '/calculation/timestamp-converter': ['时间戳转日期', '日期转时间戳', '实时转换，支持一键复制'],
    '/calculation/unit-conversions': ['文件大小：MB/GB/KB/Byte互转', '纸张尺寸：A4/A3/A5/16开/32开的尺寸换算', '字号换算：磅/号数/厘米换算', '时间单位：分钟/小时/天/周/月互转', '面积/体积/功热/速度/温度/进制等单位换算'],
    '/efficiency/qrcode-barcode-generator': ['二维码生成：输入文本/网址/联系方式，生成静态二维码', '条形码生成：支持多种条形码格式', '自定义样式：调整颜色、尺寸、添加logo', '下载PNG/SVG格式，无水印'],
    '/efficiency/password-manager': ['强密码生成：自定义长度（8-32位）、字符类型', '密码强度检测：实时检测强度（弱/中/强）', '本地存储：用localStorage加密存储密码，支持分类管理'],
    '/efficiency/habit-tracker': ['目标设置：添加每日/每周目标', '可视化追踪：用日历/进度条展示目标完成情况', '数据统计：按周/月生成完成率报表，支持导出图片', '本地保存：所有数据存储在本地'],
    '/efficiency/gantt-chart-generator': ['任务录入：输入任务名称、开始日期、结束日期、负责人', '可视化展示：生成纯文字/色块版甘特图', '延期任务标红', '导出功能：复制到Excel或导出为图片'],
    '/material/office-color-icon-library': ['配色方案：商务风、汇报风、公文风配色', '每款配色提供RGB/十六进制代码', '一键复制颜色代码', '标注适用场景', '图标素材：文件、表格、邮件、办公设备等办公场景图标', '支持SVG/PNG下载，无水印']
  }
  return featuresMap[path] || ['该工具正在开发中，敬请期待！']
})

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.tool-template-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.development-notice {
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 3rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-md);
  display: flex;
  gap: 2rem;
  align-items: center;
}

.notice-icon {
  font-size: 5rem;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-content h2 {
  font-size: 1.75rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.notice-content p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.notice-details {
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  padding: 1.5rem;
}

.notice-details h3 {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.notice-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-details li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.notice-details li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: bold;
  font-size: 1.2rem;
}

.back-home {
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.icon {
  font-size: 1.3rem;
}

@media (max-width: 768px) {
  .tool-template-page {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .development-notice {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
  
  .notice-icon {
    font-size: 4rem;
  }
  
  .notice-content h2 {
    font-size: 1.5rem;
  }
  
  .notice-content p {
    font-size: 1rem;
  }
}
</style>