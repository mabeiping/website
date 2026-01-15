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
      id: 'office',
      name: '职场办公软件',
      icon: '💼',
      tools: [
        { id: 'calculator', name: '在线计算器', path: '/office/calculator', icon: '🧮', desc: '提供基础运算和科学计算功能' },
        { id: 'unit-converter', name: '单位转换器', path: '/office/unit-converter', icon: '🔄', desc: '支持多种单位的转换，包括长度、重量、温度等' },
        { id: 'text-comparison', name: '文本比较工具', path: '/office/text-comparison', icon: '📄', desc: '对比两个文本的差异，支持高亮显示不同之处' },
        { id: 'word-counter', name: '字数统计工具', path: '/office/word-counter', icon: '🔢', desc: '统计文本的字数、字符数、段落数等信息' },
        { id: 'date-calculator', name: '日期计算器', path: '/office/date-calculator', icon: '📅', desc: '计算两个日期之间的天数差，或添加/减去指定天数' },
        { id: 'currency-converter', name: '汇率转换器', path: '/office/currency-converter', icon: '💱', desc: '实时汇率转换，支持全球主要货币' },
        { id: 'password-generator', name: '密码生成器', path: '/office/password-generator', icon: '🔐', desc: '生成高强度密码，可自定义密码长度和字符类型' },
        { id: 'qrcode-generator', name: '二维码生成器', path: '/office/qrcode-generator', icon: '📱', desc: '将文本、链接等内容生成二维码图片' },
        { id: 'pdf-converter', name: 'PDF转换工具', path: '/office/pdf-converter', icon: '📑', desc: '支持PDF与Word、Excel、图片等格式的相互转换' },
        { id: 'mind-map', name: '思维导图工具', path: '/office/mind-map', icon: '🌳', desc: '在线创建和编辑思维导图，支持导出多种格式' },
        { id: 'pomodoro-timer', name: '番茄工作法计时器', path: '/office/pomodoro-timer', icon: '⏰', desc: '基于番茄工作法的计时器，提高工作效率' },
        { id: 'meeting-notes', name: '会议记录工具', path: '/office/meeting-notes', icon: '📋', desc: '在线记录会议内容，支持实时编辑和分享' }
      ]
    },
    {
      id: 'frontend',
      name: '前端开发工具',
      icon: '💻',
      tools: [
        { id: 'css-beautifier', name: 'CSS 美化工具', path: '/frontend/css-beautifier', icon: '🎨', desc: '美化和格式化CSS代码' },
        { id: 'js-minifier', name: 'JavaScript 压缩工具', path: '/frontend/js-minifier', icon: '🗜️', desc: '压缩和优化JavaScript代码' },
        { id: 'html-validator', name: 'HTML 验证工具', path: '/frontend/html-validator', icon: '🔍', desc: '验证HTML代码的语法正确性' },
        { id: 'color-picker', name: '颜色选择器', path: '/frontend/color-picker', icon: '🎨', desc: '选择颜色并获取对应的HEX、RGB、HSL值' },
        { id: 'regex-tester', name: '正则表达式测试工具', path: '/frontend/regex-tester', icon: '🔧', desc: '测试和验证正则表达式的匹配效果' },
        { id: 'json-formatter', name: 'JSON 格式化工具', path: '/frontend/json-formatter', icon: '📋', desc: '美化、压缩和验证JSON数据' },
        { id: 'base64-encoder', name: 'Base64 编码器/解码器', path: '/frontend/base64-encoder', icon: '🔄', desc: '将文本与Base64格式相互转换' },
        { id: 'url-encoder', name: 'URL 编码器/解码器', path: '/frontend/url-encoder', icon: '🔗', desc: '将URL与编码格式相互转换' },
        { id: 'icon-generator', name: '图标生成工具', path: '/frontend/icon-generator', icon: '🖼️', desc: '生成不同尺寸的网站图标，支持多种格式' },
        { id: 'responsive-tester', name: '响应式设计测试工具', path: '/frontend/responsive-tester', icon: '📱', desc: '测试网站在不同设备尺寸下的显示效果' },
        { id: 'code-comparison', name: '代码对比工具', path: '/frontend/code-comparison', icon: '🔄', desc: '对比两段代码的差异，支持多种编程语言' },
        { id: 'performance-analyzer', name: '性能分析工具', path: '/frontend/performance-analyzer', icon: '⚡', desc: '分析网站的加载性能，提供优化建议' }
      ]
    },
    {
      id: 'games',
      name: '碎片时间小游戏',
      icon: '🎮',
      tools: [
        { id: 'snake', name: '贪吃蛇游戏', path: '/games/snake', icon: '🐍', desc: '经典的贪吃蛇游戏，锻炼反应能力' },
        { id: 'tic-tac-toe', name: '井字棋游戏', path: '/games/tic-tac-toe', icon: '❌⭕', desc: '经典的井字棋游戏，支持双人对战' },
        { id: '2048', name: '2048 游戏', path: '/games/2048', icon: '🔢', desc: '经典的数字合并游戏，挑战你的策略思维' },
        { id: 'tetris', name: '俄罗斯方块', path: '/games/tetris', icon: '🧱', desc: '经典的俄罗斯方块游戏，考验你的反应速度' },
        { id: 'minesweeper', name: '扫雷游戏', path: '/games/minesweeper', icon: '💣', desc: '经典的扫雷游戏，锻炼你的逻辑推理能力' },
        { id: 'gomoku', name: '五子棋', path: '/games/gomoku', icon: '⚫⚪', desc: '经典的五子棋游戏，支持人机对战' },
        { id: 'sudoku', name: '数独游戏', path: '/games/sudoku', icon: '🧩', desc: '经典的数独游戏，挑战你的数学思维' },
        { id: 'memory-game', name: '记忆翻牌游戏', path: '/games/memory-game', icon: '🎴', desc: '考验记忆力的翻牌游戏，适合休闲放松' },
        { id: 'link-game', name: '连连看', path: '/games/link-game', icon: '🔗', desc: '经典的连连看游戏，锻炼你的观察力' },
        { id: 'puzzle-game', name: '拼图游戏', path: '/games/puzzle-game', icon: '🧩', desc: '将打乱的图片拼成完整图案，考验你的耐心' },
        { id: 'pinball', name: '弹球游戏', path: '/games/pinball', icon: '🎱', desc: '经典的弹球游戏，享受物理碰撞的乐趣' },
        { id: 'block-crush', name: '方块消除游戏', path: '/games/block-crush', icon: '💥', desc: '消除相同颜色的方块，获得高分' }
      ]
    }
  ],
  
  // 页脚配置
  footer: {
    copyright: '© 2024 小马Office工具站. 保留所有权利.',
    description: '小马Office工具站致力于为用户提供高效、易用的在线工具集，涵盖职场办公、前端开发和休闲游戏等多个领域，帮助用户提升工作效率，丰富休闲时光。',
    features: [
      '职场办公软件：提供在线计算器和单位转换器',
      '前端开发工具：CSS美化和JavaScript压缩工具',
      '碎片时间小游戏：贪吃蛇和井字棋游戏'
    ],
    useCases: [
      '办公人员：快速进行计算和单位转换',
      '开发者：美化和压缩前端代码',
      '休闲用户：在碎片时间玩小游戏放松'
    ],
    quickLinks: [
      { name: '首页', url: '/' },
      { name: '在线计算器', url: '/office/calculator' },
      { name: 'CSS美化工具', url: '/frontend/css-beautifier' },
      { name: '贪吃蛇游戏', url: '/games/snake' }
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
