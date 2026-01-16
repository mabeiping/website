// 网站配置文件
// 用于集中管理网站的各类配置信息

const siteConfig = {
  // 网站基本信息
  site: {
    title: '小马办公工具站',
    description: '提供一系列简洁高效的办公工具，涵盖Excel数据处理、文本处理、PDF工具、格式转换、图片处理、计算换算和效率工具等多个领域',
    keywords: '小马办公工具站, Excel工具, 文本处理, PDF工具, 格式转换, 图片处理, 计算换算, 效率工具'
  },
  
  // 个人信息
  profile: {
    name: '小马办公工具站',
    avatar: '/favicon.ico',
    badges: [
      '办公工具',
      '开发者工具',
      '效率提升'
    ]
  },
  
  // // 社交媒体链接
  // social: {
  //   bilibili: {
  //     name: 'Bilibili',
  //     url: 'https://www.bilibili.com/',
  //     icon: 'bilibili'
  //   },
  //   douyin: {
  //     name: '抖音',
  //     url: 'https://www.douyin.com/',
  //     icon: 'douyin'
  //   },
  //   github: {
  //     name: 'GitHub',
  //     url: 'https://github.com/',
  //     icon: 'github'
  //   }
  // },
  
  // // 微信公众号信息
  // wechat: {
  //   title: '微信公众号',
  //   qrcode: '/qrcode.jpg',
  //   description: '扫码关注获取更多工具',
  //   link: ''
  // },
  
  // 网站主题配置
  theme: {
    defaultTheme: 'light',
    darkMode: {
      enable: true,
      autoDetect: true
    }
  },
  
  // 工具分类配置（按使用频率从高到低排序）
  toolCategories: [
    {
      name: 'Excel/数据处理类',
      tools: [
        { name: '在线计算器', path: '/excel/calculator' },
        { name: '单位转换器', path: '/excel/unit-converter' },
        { name: 'Excel函数公式查询器', path: '/excel/function-query' },
        { name: '批量生成编号/编码工具', path: '/excel/batch-number-generator' },
      ]
    },
    {
      name: '文本处理类',
      tools: [
        { name: '文本批量处理小工具', path: '/text/text-batch-processor' },
        { name: '字数统计工具', path: '/text/word-counter' },
        { name: '文本对比工具', path: '/text/text-comparison' },
        { name: '日期格式化工具', path: '/text/date-formatter' },
        { name: '正则表达式提取工具', path: '/regex/extract' },
        { name: '正则表达式生成工具', path: '/regex/generate' },
        { name: '正则表达式替换工具', path: '/regex/replace' },
        { name: '正则表达式测试工具', path: '/regex/test' }
      ]
    },
    {
      name: 'PDF工具类',
      tools: [ { name: 'PDF格式转换', path: '/pdf/format-convert' },
        { name: 'PDF合并', path: '/pdf/merge' },
        { name: 'PDF拆分', path: '/pdf/split' },
        { name: 'PDF压缩', path: '/pdf/compress' },
        { name: 'PDF旋转', path: '/pdf/rotate' },
        { name: 'PDF加密', path: '/pdf/encrypt' },
        { name: 'PDF编辑', path: '/pdf/editor' }
      ]
    },
    {
      name: '格式转换类',
      tools: [
        { name: 'Office格式转换工具', path: '/format/office-format-converter' },
        { name: '视频在线转换器', path: '/format/video-converter' },
        { name: '电子书转换器', path: '/format/ebook-converter' },
        { name: 'GIF文件处理', path: '/format/gif-processor' },
        { name: 'PDF转换工具', path: '/format/pdf-converter' }
      ]
    },
    {
      name: '图片处理类',
      tools: [
        { name: '图片无损压缩工具', path: '/image/image-compressor' },
        { name: '证件照快速处理工具', path: '/image/id-photo-processor' },
        { name: '图片批量处理工具', path: '/image/image-batch-processor' }
      ]
    },
    {
      name: '计算/换算类',
      tools: [
        { name: '工作日/节假日计算器', path: '/calculation/workday-calculator' },
        { name: '汇率转换器', path: '/calculation/currency-converter' },
        { name: '时间戳转换工具', path: '/calculation/timestamp-converter' },
        { name: '综合单位换算工具', path: '/calculation/unit-conversions' }
      ]
    },
    {
      name: '效率工具类',
      tools: [
        { name: '二维码/条形码生成器', path: '/efficiency/qrcode-barcode-generator' },
        { name: '密码生成与管理', path: '/efficiency/password-manager' },
        { name: '习惯追踪器', path: '/efficiency/habit-tracker' },
        { name: '项目甘特图简易生成器', path: '/efficiency/gantt-chart-generator' },
        { name: '会议记录工具', path: '/efficiency/meeting-notes' },
        { name: '密码生成器', path: '/efficiency/password-generator' },
        { name: '番茄工作法计时器', path: '/efficiency/pomodoro-timer' }
      ]
    }
  ],
  
  // 页脚配置
  footer: {
    copyright: '© 2026 小马办公工具站. 保留所有权利.',
    description: '小马办公工具站致力于为用户提供高效、易用的在线工具集，涵盖Excel数据处理、文本处理、PDF工具、格式转换、图片处理、计算换算和效率工具等多个领域，帮助用户提升工作效率。',
    // features: [
    //   'Excel/数据处理：计算器、单位转换、函数查询',
    //   '文本处理：批量处理、字数统计、文本对比、正则表达式工具',
    //   'PDF工具：PDF合并、拆分、压缩、旋转、加密、编辑、格式转换'
    // ],
    // useCases: [
    //   '办公人员：快速进行计算、单位转换、PDF处理',
    //   '开发者：正则测试、文本处理',
    //   '设计师：图片处理'
    // ],
    // quickLinks: [
    //   { name: '首页', url: '/' },
    //   { name: '在线计算器', url: '/office/calculator' },
    //   { name: 'PDF合并', url: '/pdf/merge' },
    //   { name: '二维码生成器', url: '/efficiency/qrcode-barcode-generator' }
    // ],
    // legalLinks: [
    //   { name: '隐私政策', url: '#' },
    //   { name: '使用条款', url: '#' },
    //   { name: '联系方式', url: '#' },
    //   { name: '关于我们', url: '#' }
    // ]
  }
}

export default siteConfig