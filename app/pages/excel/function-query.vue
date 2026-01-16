<template>
  <div class="excel-function-query-page">
    <h1 class="page-title">Excel函数公式查询器</h1>
    
    <!-- 查询区域 -->
    <div class="query-section">
      <div class="query-tabs">
        <button 
          class="tab-button" 
          :class="{ active: queryType === 'forward' }" 
          @click="queryType = 'forward'"
        >
          正向查询
        </button>
        <button 
          class="tab-button" 
          :class="{ active: queryType === 'reverse' }" 
          @click="queryType = 'reverse'"
        >
          反向查询
        </button>
      </div>
      
      <div class="query-input-group">
        <input 
          type="text" 
          class="query-input" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="请输入函数名或需求描述"
        />
        <button class="search-button" @click="handleSearch">
          <span class="icon">🔍</span> 搜索
        </button>
      </div>
    </div>
    
    <!-- 函数分类展示 -->
    <div class="function-categories">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id" 
        class="function-category"
      >
        <h2 class="category-heading">{{ category.name }}</h2>
        <div class="function-list">
          <div 
            v-for="func in category.functions" 
            :key="func.name" 
            class="function-card"
          >
            <div class="function-header">
              <h3 class="function-name">{{ func.name }}</h3>
              <button 
                class="copy-button" 
                @click="copyFunction(func)"
                :class="{ copied: copiedFunctions.includes(func.name) }"
              >
                {{ copiedFunctions.includes(func.name) ? '已复制' : '复制' }}
              </button>
            </div>
            <div class="function-details">
              <div class="detail-item">
                <strong>用法：</strong>
                <code class="function-syntax">{{ func.syntax }}</code>
              </div>
              <div class="detail-item">
                <strong>示例：</strong>
                <p class="function-example">{{ func.example }}</p>
              </div>
              <div class="detail-item">
                <strong>注意事项：</strong>
                <p class="function-notes">{{ func.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="noResults" class="empty-state">
      <p>未找到匹配的函数，请尝试其他关键词</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 函数数据定义
const functionData = [
  {
    id: 'financial',
    name: '财务计算',
    functions: [
      {
        name: 'PV',
        syntax: 'PV(rate, nper, pmt, [fv], [type])',
        example: 'PV(5%, 10, -100, 0, 0) // 返回：772.17',
        notes: 'rate为利率，nper为期数，pmt为各期支付金额，fv为未来值，type为付款时间类型',
        keywords: ['现值', '财务', '投资', '贷款']
      },
      {
        name: 'FV',
        syntax: 'FV(rate, nper, pmt, [pv], [type])',
        example: 'FV(5%, 10, -100, 0, 0) // 返回：1257.79',
        notes: 'rate为利率，nper为期数，pmt为各期支付金额，pv为现值，type为付款时间类型',
        keywords: ['终值', '未来值', '财务', '投资']
      },
      {
        name: 'PMT',
        syntax: 'PMT(rate, nper, pv, [fv], [type])',
        example: 'PMT(5%, 10, -1000) // 返回：129.50',
        notes: '计算贷款的每期付款额，rate为利率，nper为付款总期数，pv为现值',
        keywords: ['每期付款', '贷款', '月供', '财务']
      },
      {
        name: 'NPV',
        syntax: 'NPV(rate, value1, [value2], ...)',
        example: 'NPV(10%, -1000, 300, 400, 500) // 返回：118.70',
        notes: '计算投资的净现值，rate为贴现率，value1为支出或收入',
        keywords: ['净现值', '投资', '财务']
      },
      {
        name: 'IRR',
        syntax: 'IRR(values, [guess])',
        example: 'IRR({-1000, 300, 400, 500}) // 返回：13.24%',
        notes: '计算内部收益率，values为现金流数组，guess为猜测值',
        keywords: ['内部收益率', '投资回报率', '财务']
      }
    ]
  },
  {
    id: 'statistics',
    name: '数据统计',
    functions: [
      {
        name: 'AVERAGE',
        syntax: 'AVERAGE(number1, [number2], ...)',
        example: 'AVERAGE(1, 2, 3, 4, 5) // 返回：3',
        notes: '计算数值的平均值，忽略文本和逻辑值',
        keywords: ['平均分', '平均值', '统计', '平均']
      },
      {
        name: 'SUM',
        syntax: 'SUM(number1, [number2], ...)',
        example: 'SUM(1, 2, 3, 4, 5) // 返回：15',
        notes: '计算数值的总和，忽略文本和逻辑值',
        keywords: ['求和', '总和', '统计', '相加']
      },
      {
        name: 'COUNT',
        syntax: 'COUNT(value1, [value2], ...)',
        example: 'COUNT(A1:A10) // 返回：非空单元格数量',
        notes: '统计数值单元格的数量，忽略文本和逻辑值',
        keywords: ['计数', '统计数量', '单元格数量']
      },
      {
        name: 'MAX',
        syntax: 'MAX(number1, [number2], ...)',
        example: 'MAX(1, 3, 5, 2, 4) // 返回：5',
        notes: '返回数值中的最大值，忽略文本和逻辑值',
        keywords: ['最大值', '最大', '统计']
      },
      {
        name: 'MIN',
        syntax: 'MIN(number1, [number2], ...)',
        example: 'MIN(1, 3, 5, 2, 4) // 返回：1',
        notes: '返回数值中的最小值，忽略文本和逻辑值',
        keywords: ['最小值', '最小', '统计']
      },
      {
        name: 'COUNTIF',
        syntax: 'COUNTIF(range, criteria)',
        example: 'COUNTIF(A1:A10, ">50") // 返回：大于50的单元格数量',
        notes: '根据条件统计单元格数量，支持通配符*和?',
        keywords: ['条件计数', '统计满足条件', '重复值']
      },
      {
        name: 'SUMIF',
        syntax: 'SUMIF(range, criteria, [sum_range])',
        example: 'SUMIF(A1:A10, ">50", B1:B10) // 返回：A列>50对应B列的和',
        notes: '根据条件求和，支持通配符*和?',
        keywords: ['条件求和', '按条件相加', '统计']
      },
      {
        name: 'VLOOKUP',
        syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
        example: 'VLOOKUP("张三", A1:B10, 2, FALSE) // 返回：张三对应的B列值',
        notes: '垂直查找函数，range_lookup为TRUE时近似匹配，FALSE时精确匹配',
        keywords: ['查找', '匹配', '垂直查找', '查表']
      },
      {
        name: 'HLOOKUP',
        syntax: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
        example: 'HLOOKUP("销售额", A1:J10, 5, FALSE) // 返回：销售额对应的第5行值',
        notes: '水平查找函数，range_lookup为TRUE时近似匹配，FALSE时精确匹配',
        keywords: ['水平查找', '查找', '匹配', '查表']
      }
    ]
  },
  {
    id: 'logical',
    name: '逻辑判断',
    functions: [
      {
        name: 'IF',
        syntax: 'IF(logical_test, value_if_true, [value_if_false])',
        example: 'IF(A1>60, "及格", "不及格") // 返回：根据A1值返回及格或不及格',
        notes: '条件判断函数，支持嵌套使用',
        keywords: ['如果', '条件判断', '逻辑', '分支']
      },
      {
        name: 'AND',
        syntax: 'AND(logical1, [logical2], ...)',
        example: 'AND(A1>60, B1>60) // 返回：A1和B1都>60时为TRUE',
        notes: '逻辑与函数，所有条件为TRUE时返回TRUE',
        keywords: ['并且', '逻辑与', '同时满足', '条件']
      },
      {
        name: 'OR',
        syntax: 'OR(logical1, [logical2], ...)',
        example: 'OR(A1>60, B1>60) // 返回：A1或B1>60时为TRUE',
        notes: '逻辑或函数，任一条件为TRUE时返回TRUE',
        keywords: ['或者', '逻辑或', '任一满足', '条件']
      },
      {
        name: 'NOT',
        syntax: 'NOT(logical)',
        example: 'NOT(A1>60) // 返回：A1>60时为FALSE，否则为TRUE',
        notes: '逻辑非函数，反转逻辑值',
        keywords: ['非', '逻辑非', '反转', '条件']
      },
      {
        name: 'IFERROR',
        syntax: 'IFERROR(value, value_if_error)',
        example: 'IFERROR(1/0, "错误") // 返回：错误',
        notes: '捕获错误值，返回指定的替代值',
        keywords: ['错误处理', '捕获错误', '异常处理']
      }
    ]
  },
  {
    id: 'text',
    name: '文本处理',
    functions: [
      {
        name: 'LEFT',
        syntax: 'LEFT(text, [num_chars])',
        example: 'LEFT("Hello World", 5) // 返回：Hello',
        notes: '从文本左侧提取指定字符数，num_chars省略时返回全部',
        keywords: ['左侧', '提取', '字符串']
      },
      {
        name: 'RIGHT',
        syntax: 'RIGHT(text, [num_chars])',
        example: 'RIGHT("Hello World", 5) // 返回：World',
        notes: '从文本右侧提取指定字符数，num_chars省略时返回全部',
        keywords: ['右侧', '提取', '字符串']
      },
      {
        name: 'MID',
        syntax: 'MID(text, start_num, [num_chars])',
        example: 'MID("Hello World", 7, 5) // 返回：World',
        notes: '从文本中间提取指定字符数，start_num从1开始',
        keywords: ['中间', '提取', '字符串']
      },
      {
        name: 'LEN',
        syntax: 'LEN(text)',
        example: 'LEN("Hello") // 返回：5',
        notes: '返回文本的字符长度',
        keywords: ['长度', '字符数', '字符串长度']
      },
      {
        name: 'TRIM',
        syntax: 'TRIM(text)',
        example: 'TRIM("  Hello  ") // 返回：Hello',
        notes: '删除文本首尾的空格',
        keywords: ['去空格', '清理', '修剪']
      },
      {
        name: 'CONCATENATE',
        syntax: 'CONCATENATE(text1, [text2], ...)',
        example: 'CONCATENATE("Hello", " ", "World") // 返回：Hello World',
        notes: '连接多个文本字符串',
        keywords: ['连接', '拼接', '合并']
      },
      {
        name: 'UPPER',
        syntax: 'UPPER(text)',
        example: 'UPPER("hello") // 返回：HELLO',
        notes: '将文本转换为大写',
        keywords: ['大写', '转大写', '转换']
      },
      {
        name: 'LOWER',
        syntax: 'LOWER(text)',
        example: 'LOWER("HELLO") // 返回：hello',
        notes: '将文本转换为小写',
        keywords: ['小写', '转小写', '转换']
      }
    ]
  },
  {
    id: 'date',
    name: '日期时间',
    functions: [
      {
        name: 'TODAY',
        syntax: 'TODAY()',
        example: 'TODAY() // 返回：2024-01-15',
        notes: '返回当前日期',
        keywords: ['今天', '当前日期', '今日']
      },
      {
        name: 'NOW',
        syntax: 'NOW()',
        example: 'NOW() // 返回：2024-01-15 14:30:00',
        notes: '返回当前日期和时间',
        keywords: ['现在', '当前时间', '当前日期时间']
      },
      {
        name: 'YEAR',
        syntax: 'YEAR(date)',
        example: 'YEAR("2024-01-15") // 返回：2024',
        notes: '从日期中提取年份',
        keywords: ['年份', '年', '提取年份']
      },
      {
        name: 'MONTH',
        syntax: 'MONTH(date)',
        example: 'MONTH("2024-01-15") // 返回：1',
        notes: '从日期中提取月份',
        keywords: ['月份', '月', '提取月份']
      },
      {
        name: 'DAY',
        syntax: 'DAY(date)',
        example: 'DAY("2024-01-15") // 返回：15',
        notes: '从日期中提取日',
        keywords: ['日', '天', '提取日期']
      },
      {
        name: 'DATEDIF',
        syntax: 'DATEDIF(start_date, end_date, unit)',
        example: 'DATEDIF("2023-01-01", "2024-01-01", "Y") // 返回：1',
        notes: '计算两个日期之间的间隔，unit为Y年、M月、D天',
        keywords: ['日期差', '间隔', '计算日期差']
      },
      {
        name: 'WEEKDAY',
        syntax: 'WEEKDAY(date, [return_type])',
        example: 'WEEKDAY("2024-01-15") // 返回：1',
        notes: '返回日期是星期几，1=星期日，7=星期六',
        keywords: ['星期', '周几', '工作日']
      }
    ]
  },
  {
    id: 'lookup',
    name: '查找引用',
    functions: [
      {
        name: 'INDEX',
        syntax: 'INDEX(array, row_num, [column_num])',
        example: 'INDEX(A1:C10, 3, 2) // 返回：B3',
        notes: '返回表格或数组中指定位置的值',
        keywords: ['索引', '位置', '查找']
      },
      {
        name: 'MATCH',
        syntax: 'MATCH(lookup_value, lookup_array, [match_type])',
        example: 'MATCH("张三", A1:A10, 0) // 返回：3',
        notes: '在数组中查找值的位置，match_type为0精确匹配',
        keywords: ['匹配', '位置', '查找位置']
      },
      {
        name: 'OFFSET',
        syntax: 'OFFSET(reference, rows, cols, [height], [width])',
        example: 'OFFSET(A1, 2, 1) // 返回：B3',
        notes: '从指定位置开始返回指定范围的单元格引用',
        keywords: ['偏移', '相对引用', '移动']
      },
      {
        name: 'INDIRECT',
        syntax: 'INDIRECT(ref_text)',
        example: 'INDIRECT("A1") // 返回：A1单元格的值',
        notes: '返回文本字符串指定的引用',
        keywords: ['间接', '引用', '动态引用']
      }
    ]
  },
  {
    id: 'math',
    name: '数学三角',
    functions: [
      {
        name: 'ROUND',
        syntax: 'ROUND(number, [num_digits])',
        example: 'ROUND(3.14159, 2) // 返回：3.14',
        notes: '四舍五入到指定小数位，num_digits省略时为0',
        keywords: ['四舍五入', '取整', '舍入']
      },
      {
        name: 'ROUNDUP',
        syntax: 'ROUNDUP(number, [num_digits])',
        example: 'ROUNDUP(3.2, 1) // 返回：4',
        notes: '向上舍入到指定小数位',
        keywords: ['向上舍入', '向上取整']
      },
      {
        name: 'ROUNDDOWN',
        syntax: 'ROUNDDOWN(number, [num_digits])',
        example: 'ROUNDDOWN(3.8, 1) // 返回：3',
        notes: '向下舍入到指定小数位',
        keywords: ['向下舍入', '向下取整']
      },
      {
        name: 'ABS',
        syntax: 'ABS(number)',
        example: 'ABS(-5) // 返回：5',
        notes: '返回数值的绝对值',
        keywords: ['绝对值', '正数', '绝对值']
      },
      {
        name: 'POWER',
        syntax: 'POWER(number, power)',
        example: 'POWER(2, 3) // 返回：8',
        notes: '计算数值的指定次幂',
        keywords: ['幂', '次方', '乘方']
      },
      {
        name: 'SQRT',
        syntax: 'SQRT(number)',
        example: 'SQRT(16) // 返回：4',
        notes: '计算数值的平方根',
        keywords: ['平方根', '根号', '开方']
      },
      {
        name: 'MOD',
        syntax: 'MOD(number, divisor)',
        example: 'MOD(10, 3) // 返回：1',
        notes: '返回两数相除的余数',
        keywords: ['余数', '取模', '求余']
      },
      {
        name: 'RAND',
        syntax: 'RAND()',
        example: 'RAND() // 返回：0.123...',
        notes: '返回0到1之间的随机数',
        keywords: ['随机数', '随机', '生成随机']
      },
      {
        name: 'RANDBETWEEN',
        syntax: 'RANDBETWEEN(bottom, top)',
        example: 'RANDBETWEEN(1, 100) // 返回：42',
        notes: '返回指定范围之间的随机整数',
        keywords: ['随机范围', '范围随机']
      }
    ]
  }
]

// 响应式状态
const queryType = ref('forward')
const searchQuery = ref('')
const copiedFunctions = ref([])

// 计算属性：过滤后的分类
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return functionData
  }
  
  const query = searchQuery.value.trim().toLowerCase()
  
  return functionData.map(category => {
    let filteredFunctions = []
    
    if (queryType.value === 'forward') {
      // 正向查询：匹配函数名
      filteredFunctions = category.functions.filter(func => 
        func.name.toLowerCase().includes(query)
      )
    } else {
      // 反向查询：匹配关键词
      filteredFunctions = category.functions.filter(func => 
        func.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )
    }
    
    return {
      ...category,
      functions: filteredFunctions
    }
  }).filter(category => category.functions.length > 0)
})

// 计算属性：是否无结果
const noResults = computed(() => {
  if (!searchQuery.value.trim()) return false
  
  return filteredCategories.value.every(category => category.functions.length === 0)
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

// 复制函数信息
const copyFunction = (func) => {
  const funcText = `${func.name}\n用法：${func.syntax}\n示例：${func.example}\n注意事项：${func.notes}`
  
  navigator.clipboard.writeText(funcText).then(() => {
    copiedFunctions.value.push(func.name)
    setTimeout(() => {
      copiedFunctions.value = copiedFunctions.value.filter(name => name !== func.name)
    }, 2000)
  })
}
</script>

<style scoped>
.excel-function-query-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

/* 查询区域样式 */
.query-section {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
}

.query-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  font-weight: 600;
}

.tab-button:hover {
  color: var(--color-primary);
}

.query-input-group {
  display: flex;
  gap: 0.75rem;
}

.query-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.query-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 函数分类样式 */
.function-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.function-category {
  background-color: var(--color-bg-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.category-heading {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.function-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
}

.function-card {
  background-color: var(--color-bg-secondary);
  border-radius: 6px;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.function-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.function-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.function-name {
  font-size: 1.25rem;
  color: var(--color-text-primary);
  margin: 0;
}

.copy-button {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-button:hover {
  background-color: var(--color-primary-hover);
}

.copy-button.copied {
  background-color: var(--color-success);
}

.function-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  margin: 0;
  line-height: 1.6;
}

.function-syntax {
  background-color: var(--color-bg-tertiary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--color-text-primary);
}

.function-example {
  margin: 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.function-notes {
  margin: 0;
  color: var(--color-text-secondary);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  background-color: var(--color-bg-card);
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .excel-function-query-page {
    padding: 1rem;
  }
  
  .function-list {
    grid-template-columns: 1fr;
  }
  
  .query-input-group {
    flex-direction: column;
  }
  
  .search-button {
    justify-content: center;
  }
}
</style>