<template>
  <svg 
    :class="className" 
    :width="size" 
    :height="size" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <!-- 职场办公软件图标 -->
    <g v-if="name === 'calculator' || name === '🧮'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </g>
    
    <g v-else-if="name === 'unit-converter' || name === '🔄'">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </g>
    
    <g v-else-if="name === 'text-comparison' || name === '📄'">
      <rect x="3" y="6" width="18" height="12" rx="2" ry="2"></rect>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="12" y1="6" x2="12" y2="18"></line>
    </g>
    
    <g v-else-if="name === 'word-counter' || name === '🔢'">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </g>
    
    <g v-else-if="name === 'date-calculator' || name === '📅'">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </g>
    
    <g v-else-if="name === 'currency-converter' || name === '💱'">
      <path d="M12 22c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"></path>
      <path d="M12 2v20"></path>
      <path d="M19.071 4.929l-7.071 7.071"></path>
      <path d="M4.929 4.929l7.071 7.071"></path>
    </g>
    
    <g v-else-if="name === 'password-generator' || name === '🔐'">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      <line x1="12" y1="16" x2="12" y2="16"></line>
    </g>
    
    <g v-else-if="name === 'qrcode-generator' || name === '📱'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <rect x="7" y="7" width="3" height="3"></rect>
      <rect x="14" y="7" width="3" height="3"></rect>
      <rect x="7" y="14" width="3" height="3"></rect>
      <rect x="14" y="14" width="3" height="3"></rect>
    </g>
    
    <g v-else-if="name === 'pdf-converter' || name === '📑'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </g>
    
    <g v-else-if="name === 'mind-map' || name === '🌳'">
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="12" y1="6" x2="12" y2="9"></line>
      <line x1="6" y1="12" x2="9" y2="12"></line>
      <line x1="12" y1="15" x2="12" y2="18"></line>
      <line x1="15" y1="12" x2="18" y2="12"></line>
      <circle cx="12" cy="3" r="2"></circle>
      <circle cx="3" cy="12" r="2"></circle>
      <circle cx="12" cy="21" r="2"></circle>
      <circle cx="21" cy="12" r="2"></circle>
    </g>
    
    <g v-else-if="name === 'pomodoro-timer' || name === '⏰'">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </g>
    
    <g v-else-if="name === 'meeting-notes' || name === '📋'">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </g>
    
    <!-- 前端开发工具图标 -->
    <g v-else-if="name === 'css-beautifier' || name === '🎨'">
      <rect x="12" y="2" width="8" height="20"></rect>
      <rect x="4" y="2" width="8" height="20"></rect>
      <path d="M2 12h20"></path>
    </g>
    
    <g v-else-if="name === 'js-minifier' || name === '🗜️'">
      <path d="M15 3H9a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
      <polyline points="12 10 12 14"></polyline>
      <polyline points="16 10 16 14"></polyline>
    </g>
    
    <g v-else-if="name === 'html-validator' || name === '🔍'">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </g>
    
    <g v-else-if="name === 'color-picker' || name === '🎨'">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20z"></path>
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z"></path>
    </g>
    
    <g v-else-if="name === 'regex-tester' || name === '🔧'">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M14.31 8l5.74 9.94a2 2 0 0 1-1.75 2.96H4.91a2 2 0 0 1-1.75-2.96L9.69 8a2 2 0 0 1 4.62 0z"></path>
    </g>
    
    <g v-else-if="name === 'json-formatter' || name === '📋'">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </g>
    
    <g v-else-if="name === 'base64-encoder' || name === '🔄'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </g>
    
    <g v-else-if="name === 'url-encoder' || name === '🔗'">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <line x1="12" y1="5" x2="12" y2="19"></line>
    </g>
    
    <g v-else-if="name === 'icon-generator' || name === '🖼️'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="6"></circle>
    </g>
    
    <g v-else-if="name === 'responsive-tester' || name === '📱'">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="6" x2="12" y2="18"></line>
    </g>
    
    <g v-else-if="name === 'code-comparison' || name === '🔄'">
      <rect x="3" y="6" width="9" height="12" rx="2" ry="2"></rect>
      <rect x="12" y="6" width="9" height="12" rx="2" ry="2"></rect>
      <line x1="9" y1="9" x2="12" y2="9"></line>
      <line x1="9" y1="15" x2="12" y2="15"></line>
    </g>
    
    <g v-else-if="name === 'performance-analyzer' || name === '⚡'">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </g>
    
    <!-- 碎片时间小游戏图标 -->
    <g v-else-if="name === 'snake' || name === '🐍'">
      <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10z"></path>
      <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z"></path>
      <circle cx="17" cy="7" r="2"></circle>
      <path d="M17 7l2 2"></path>
    </g>
    
    <g v-else-if="name === 'tic-tac-toe' || name === '❌⭕'">
      <line x1="8" y1="8" x2="16" y2="16"></line>
      <line x1="16" y1="8" x2="8" y2="16"></line>
      <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
    </g>
    
    <g v-else-if="name === '2048' || name === '🔢'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
    </g>
    
    <g v-else-if="name === 'tetris' || name === '🧱'">
      <rect x="5" y="3" width="4" height="4"></rect>
      <rect x="9" y="3" width="4" height="4"></rect>
      <rect x="13" y="3" width="4" height="4"></rect>
      <rect x="13" y="7" width="4" height="4"></rect>
      <rect x="5" y="7" width="4" height="4"></rect>
      <rect x="9" y="11" width="4" height="4"></rect>
    </g>
    
    <g v-else-if="name === 'minesweeper' || name === '💣'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="12" cy="12" r="6"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </g>
    
    <g v-else-if="name === 'gomoku' || name === '⚫⚪'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="6" y1="3" x2="6" y2="21"></line>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="12" y1="3" x2="12" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
      <line x1="18" y1="3" x2="18" y2="21"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
      <circle cx="12" cy="12" r="2"></circle>
    </g>
    
    <g v-else-if="name === 'sudoku' || name === '🧩'">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
      <circle cx="6" cy="6" r="1"></circle>
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="18" cy="18" r="1"></circle>
    </g>
    
    <g v-else-if="name === 'memory-game' || name === '🎴'">
      <rect x="5" y="5" width="6" height="8" rx="1" ry="1"></rect>
      <rect x="13" y="5" width="6" height="8" rx="1" ry="1"></rect>
      <rect x="5" y="13" width="6" height="8" rx="1" ry="1"></rect>
      <rect x="13" y="13" width="6" height="8" rx="1" ry="1"></rect>
      <circle cx="8" cy="9" r="1"></circle>
      <circle cx="16" cy="17" r="1"></circle>
    </g>
    
    <g v-else-if="name === 'link-game' || name === '🔗'">
      <circle cx="8" cy="8" r="3"></circle>
      <circle cx="16" cy="16" r="3"></circle>
      <line x1="11" y1="8" x2="13" y2="16"></line>
    </g>
    
    <g v-else-if="name === 'puzzle-game' || name === '🧩'">
      <rect x="5" y="5" width="5" height="5"></rect>
      <rect x="14" y="5" width="5" height="5"></rect>
      <rect x="5" y="14" width="5" height="5"></rect>
      <rect x="14" y="14" width="5" height="5"></rect>
      <line x1="10" y1="7" x2="14" y2="7"></line>
      <line x1="10" y1="17" x2="14" y2="17"></line>
      <line x1="7" y1="10" x2="7" y2="14"></line>
      <line x1="17" y1="10" x2="17" y2="14"></line>
    </g>
    
    <g v-else-if="name === 'pinball' || name === '🎱'">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="2" x2="12" y2="4"></line>
      <line x1="6" y1="6" x2="8" y2="8"></line>
      <line x1="18" y1="6" x2="16" y2="8"></line>
      <circle cx="12" cy="18" r="2"></circle>
    </g>
    
    <g v-else-if="name === 'block-crush' || name === '💥'">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10 10 10 0 0 0-10-10z"></path>
      <line x1="12" y1="6" x2="12" y2="18"></line>
      <line x1="6" y1="12" x2="18" y2="12"></line>
    </g>
    
    <!-- 默认图标 -->
    <g v-else>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  className: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="scss">
@import '../styles/Icon.scss';
</style>