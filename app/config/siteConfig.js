// 网站配置文件
// 用于集中管理网站的各类配置信息

const siteConfig = {
  // 网站基本信息
  site: {
    title: '工具网站', // 网站标题
    favicon: '/favicon.ico', // 网站图标链接
    description: '提供一系列简洁高效的办公工具，涵盖正则表达式、文本处理、编码转换、JSON处理和时间日期计算等多个领域',
    keywords: '工具网站, 正则表达式, 文本处理, 编码转换, JSON处理, 时间日期计算'
  },
  
  // 个人信息
  profile: {
    name: '网站名称',
    avatar: '/favicon.ico',
    badges: [
      '办公工具',
      '开发者工具',
      '效率提升'
    ]
  },
  
  // 社交媒体链接
  social: {
    bilibili: {
      name: 'Bilibili',
      url: 'https://www.bilibili.com/',
      icon: 'bilibili'
    },
    douyin: {
      name: '抖音',
      url: 'https://www.douyin.com/',
      icon: 'douyin'
    },
    github: {
      name: 'GitHub',
      url: 'https://github.com/',
      icon: 'github'
    }
  },
  
  // 微信公众号信息
  wechat: {
    title: '微信公众号',
    qrcode: '/qrcode.jpg',
    description: '扫码关注获取更多工具',
    link: '' // 公众号链接，如无则留空
  },
  
  // 网站主题配置
  theme: {
    defaultTheme: 'light', // 默认主题：light 或 dark
    darkMode: {
      enable: true,
      autoDetect: true // 是否自动检测系统主题
    }
  },
  
  // 工具分类配置
  toolCategories: [
    {
      id: 'regex',
      name: '正则表达式工具',
      icon: '📋',
      tools: [
        { id: 'regex-extract', name: '正则表达式提取', path: '/regex/extract', icon: '📋', desc: '提取匹配的文本内容' },
        { id: 'regex-test', name: '正则表达式测试', path: '/regex/test', icon: '✓', desc: '测试正则表达式匹配' },
        { id: 'regex-generate', name: '正则表达式生成', path: '/regex/generate', icon: '✨', desc: '生成常用正则表达式' },
        { id: 'regex-replace', name: '正则表达式替换', path: '/regex/replace', icon: '🔄', desc: '替换匹配的文本内容' }
      ]
    },
    {
      id: 'text',
      name: '文本处理工具',
      icon: '📝',
      tools: [
        { id: 'text-extract', name: '文本提取', path: '/text/extract', icon: '📌', desc: '从文本中提取指定内容' },
        { id: 'text-replace', name: '文本替换', path: '/text/replace', icon: '🔁', desc: '替换文本中的特定内容' },
        { id: 'text-format', name: '文本格式化', path: '/text/format', icon: '🎨', desc: '美化文本格式' },
        { id: 'text-split', name: '文本分割与合并', path: '/text/split', icon: '🔗', desc: '分割或合并文本' }
      ]
    },
    {
      id: 'encode',
      name: '编码转换工具',
      icon: '🔢',
      tools: [
        { id: 'base64', name: 'Base64 编码/解码', path: '/encode/base64', icon: '🔢', desc: 'Base64编解码转换' },
        { id: 'url', name: 'URL 编码/解码', path: '/encode/url', icon: '🌐', desc: 'URL编解码转换' },
        { id: 'html', name: 'HTML 实体转换', path: '/encode/html', icon: '<>', desc: 'HTML实体转换' }
      ]
    },
    {
      id: 'json',
      name: 'JSON 工具',
      icon: '📄',
      tools: [
        { id: 'json-format', name: 'JSON 格式化', path: '/json/format', icon: '🎯', desc: '美化JSON格式' },
        { id: 'json-compress', name: 'JSON 压缩', path: '/json/compress', icon: '🗜️', desc: '压缩JSON内容' },
        { id: 'json-convert', name: 'JSON 转其他格式', path: '/json/convert', icon: '🔄', desc: 'JSON转换为其他格式' }
      ]
    },
    {
      id: 'time',
      name: '时间日期工具',
      icon: '⏰',
      tools: [
        { id: 'timestamp', name: '时间戳转换', path: '/time/timestamp', icon: '🔢', desc: '时间戳转换为日期' },
        { id: 'date-calc', name: '日期计算', path: '/time/calc', icon: '📅', desc: '日期加减计算' },
        { id: 'timezone', name: '时区转换', path: '/time/timezone', icon: '🌍', desc: '不同时区转换' }
      ]
    }
  ],
  
  // 页脚配置
  footer: {
    copyright: '© 2024 小马Office工具站. 保留所有权利.',
    description: '小马Office工具站致力于为开发者和办公人员提供高效、易用的在线工具集，涵盖正则表达式、文本处理、编码转换等多个领域，帮助用户提升工作效率，简化复杂任务。',
    features: [
      '正则表达式工具：提取、测试、生成和替换',
      '文本处理工具：提取、替换、格式化和分割',
      '编码转换工具：Base64、URL和HTML实体转换',
      'JSON工具：格式化、压缩和格式转换',
      '时间日期工具：时间戳转换、日期计算和时区转换'
    ],
    useCases: [
      '开发者：快速测试正则表达式，转换编码',
      '办公人员：批量处理文本，格式化数据',
      '学生：学习正则表达式，处理作业数据',
      '设计师：转换文本格式，准备数据素材'
    ],
    quickLinks: [
      { name: '首页', url: '/' },
      { name: '正则表达式工具', url: '/regex/extract' },
      { name: '文本处理工具', url: '/text/extract' },
      { name: '编码转换工具', url: '/encode/base64' },
      { name: 'JSON工具', url: '/json/format' },
      { name: '时间日期工具', url: '/time/timestamp' }
    ],
    legalLinks: [
      { name: '隐私政策', url: '#' },
      { name: '使用条款', url: '#' },
      { name: '联系方式', url: '#' },
      { name: '关于我们', url: '#' }
    ]
  }
}

export default siteConfig
