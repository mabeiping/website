import { ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { P as ProfileAside } from './ProfileAside-C3eMv-oi.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = {
  __name: "replace",
  __ssrInlineRender: true,
  setup(__props) {
    const regex = ref("");
    const replaceWith = ref("");
    const testText = ref("");
    const flags = ref({
      g: true,
      i: false,
      m: false
    });
    const regexError = ref("");
    const resultText = ref("");
    const matchCount = ref(0);
    const templates = [
      {
        id: "remove-spaces",
        name: "移除所有空格",
        pattern: "\\s+",
        replace: "",
        description: "移除文本中所有空格字符"
      },
      {
        id: "normalize-spaces",
        name: "标准化空格",
        pattern: "\\s+",
        replace: " ",
        description: "将连续空格替换为单个空格"
      },
      {
        id: "add-https",
        name: "添加HTTPS前缀",
        pattern: "^(www\\.)",
        replace: "https://$1",
        description: "为网址添加HTTPS前缀"
      },
      {
        id: "capitalize",
        name: "首字母大写",
        pattern: "\\b(\\w)(\\w*)\\b",
        replace: "$1".toUpperCase() + "$2",
        description: "将每个单词首字母大写"
      },
      {
        id: "remove-html",
        name: "移除HTML标签",
        pattern: "<[^>]+>",
        replace: "",
        description: "移除文本中的所有HTML标签"
      },
      {
        id: "extract-emails",
        name: "提取邮箱地址",
        pattern: ".*?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}).*?",
        replace: "$1\\n",
        description: "从文本中提取所有邮箱地址"
      },
      {
        id: "format-phone",
        name: "格式化电话号码",
        pattern: "(\\d{3})(\\d{3})(\\d{4})",
        replace: "$1-$2-$3",
        description: "将1234567890格式化为123-456-7890"
      },
      {
        id: "remove-duplicates",
        name: "移除重复行",
        pattern: "(.*)(\\r?\\n\\1)+$",
        replace: "$1",
        description: "移除文本中的重复行"
      },
      {
        id: "remove-newlines",
        name: "移除换行符",
        pattern: "\\r?\\n",
        replace: "",
        description: "移除所有换行符"
      },
      {
        id: "replace-newlines",
        name: "替换换行符",
        pattern: "\\r?\\n",
        replace: " ",
        description: "将换行符替换为空格"
      },
      {
        id: "remove-tabs",
        name: "移除制表符",
        pattern: "\\t",
        replace: "",
        description: "移除所有制表符"
      },
      {
        id: "remove-punctuation",
        name: "移除标点符号",
        pattern: "[.,!?;:，。！？；：]",
        replace: "",
        description: "移除常见标点符号"
      },
      {
        id: "add-line-numbers",
        name: "添加行号",
        pattern: "^",
        replace: "$& ",
        description: "为每行添加行号（需要配合其他工具）"
      },
      {
        id: "wrap-in-quotes",
        name: "用引号包裹",
        pattern: "^(.+)$",
        replace: '"$1"',
        description: "用双引号包裹每行"
      },
      {
        id: "escape-html",
        name: "转义HTML",
        pattern: "&",
        replace: "&amp;",
        description: "转义HTML特殊字符"
      },
      {
        id: "remove-comments",
        name: "移除单行注释",
        pattern: "//.*",
        replace: "",
        description: "移除代码中的单行注释"
      },
      {
        id: "format-date",
        name: "格式化日期",
        pattern: "(\\d{4})-(\\d{2})-(\\d{2})",
        replace: "$2/$3/$1",
        description: "将YYYY-MM-DD格式化为MM/DD/YYYY"
      },
      {
        id: "reverse-words",
        name: "反转单词顺序",
        pattern: "(\\w+)\\s+",
        replace: "$1 ",
        description: "反转单词顺序（需要配合其他工具）"
      },
      {
        id: "uppercase",
        name: "转大写",
        pattern: "[a-z]",
        replace: "$&".toUpperCase(),
        description: "将字母转为大写"
      },
      {
        id: "lowercase",
        name: "转小写",
        pattern: "[A-Z]",
        replace: "$&".toLowerCase(),
        description: "将字母转为小写"
      },
      {
        id: "remove-digits",
        name: "移除数字",
        pattern: "\\d",
        replace: "",
        description: "移除所有数字"
      },
      {
        id: "remove-letters",
        name: "移除字母",
        pattern: "[a-zA-Z]",
        replace: "",
        description: "移除所有字母"
      },
      {
        id: "extract-urls",
        name: "提取网址",
        pattern: ".*?(https?:\\/\\/[^\\s]+).*?",
        replace: "$1\\n",
        description: "从文本中提取所有网址"
      },
      {
        id: "extract-phone",
        name: "提取手机号",
        pattern: ".*?(1[3-9]\\d{9}).*?",
        replace: "$1\\n",
        description: "从文本中提取所有手机号"
      },
      {
        id: "format-currency",
        name: "格式化货币",
        pattern: "(\\d)(?=(\\d{3})+(?!\\d))",
        replace: "$1,",
        description: "为数字添加千分位分隔符"
      },
      {
        id: "remove-brackets",
        name: "移除括号内容",
        pattern: "\\([^)]*\\)",
        replace: "",
        description: "移除圆括号及其内容"
      },
      {
        id: "trim-spaces",
        name: "去除首尾空格",
        pattern: "^\\s+|\\s+$",
        replace: "",
        description: "去除每行首尾空格"
      },
      {
        id: "replace-comma",
        name: "逗号转分号",
        pattern: ",",
        replace: ";",
        description: "将逗号替换为分号"
      },
      {
        id: "extract-ips",
        name: "提取IP地址",
        pattern: ".*?((?:[0-9]{1,3}\\.){3}[0-9]{1,3}).*?",
        replace: "$1\\n",
        description: "从文本中提取所有IP地址"
      },
      {
        id: "remove-special-chars",
        name: "移除特殊字符",
        pattern: "[^a-zA-Z0-9\\s]",
        replace: "",
        description: "移除所有特殊字符，只保留字母数字和空格"
      },
      {
        id: "add-brackets",
        name: "添加括号",
        pattern: "^(.+)$",
        replace: "($1)",
        description: "为每行添加圆括号"
      },
      {
        id: "remove-empty-lines",
        name: "移除空行",
        pattern: "^\\s*\\r?\\n",
        replace: "",
        description: "移除所有空行"
      },
      {
        id: "extract-numbers",
        name: "提取数字",
        pattern: ".*?(-?\\d+(?:\\.\\d+)?).*?",
        replace: "$1\\n",
        description: "从文本中提取所有数字"
      },
      {
        id: "format-json",
        name: "格式化JSON",
        pattern: ",",
        replace: ",\\n",
        description: "在逗号后添加换行（简化版JSON格式化）"
      },
      {
        id: "remove-duplicate-words",
        name: "移除重复单词",
        pattern: "\\b(\\w+)\\s+\\1\\b",
        replace: "$1",
        description: "移除相邻的重复单词"
      }
    ];
    watch([regex, replaceWith, testText, flags], () => {
      updateResult();
    }, { deep: true });
    const updateResult = () => {
      resultText.value = "";
      matchCount.value = 0;
      regexError.value = "";
      if (!regex.value || !testText.value) {
        return;
      }
      try {
        let flagsStr = "";
        if (flags.value.g) flagsStr += "g";
        if (flags.value.i) flagsStr += "i";
        if (flags.value.m) flagsStr += "m";
        const regexObj = new RegExp(regex.value, flagsStr);
        const matches = [...testText.value.matchAll(regexObj)];
        matchCount.value = matches.length;
        resultText.value = testText.value.replace(regexObj, replaceWith.value);
      } catch (error) {
        regexError.value = `正则表达式错误: ${error.message}`;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))} data-v-7793a099><div class="regex-page" data-v-7793a099><h1 class="page-title" data-v-7793a099>正则表达式替换工具</h1><div class="tool-description" data-v-7793a099><p data-v-7793a099>使用正则表达式替换文本中的匹配内容，支持实时预览替换结果。</p></div><div class="input-section" data-v-7793a099><div class="input-row" data-v-7793a099><div class="input-group" data-v-7793a099><label for="regex-input" data-v-7793a099>正则表达式</label><div class="regex-input-container" data-v-7793a099><input type="text" id="regex-input"${ssrRenderAttr("value", regex.value)} placeholder="输入正则表达式，如：\\\\d{3}-\\\\d{3}-\\\\d{4}" class="regex-input" data-v-7793a099><div class="regex-flags" data-v-7793a099><label data-v-7793a099><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.g) ? ssrLooseContain(flags.value.g, null) : flags.value.g) ? " checked" : ""} id="global-flag" data-v-7793a099> g (全局替换)</label><label data-v-7793a099><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.i) ? ssrLooseContain(flags.value.i, null) : flags.value.i) ? " checked" : ""} id="ignorecase-flag" data-v-7793a099> i (忽略大小写)</label><label data-v-7793a099><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.m) ? ssrLooseContain(flags.value.m, null) : flags.value.m) ? " checked" : ""} id="multiline-flag" data-v-7793a099> m (多行模式)</label></div></div></div></div><div class="input-row" data-v-7793a099><div class="input-group full-width" data-v-7793a099><label for="replace-with" data-v-7793a099>替换为</label><input type="text" id="replace-with"${ssrRenderAttr("value", replaceWith.value)} placeholder="输入替换文本，如：***-***-$4" class="replace-with-input" data-v-7793a099></div></div><div class="input-row" data-v-7793a099><div class="input-group full-width" data-v-7793a099><label for="test-text" data-v-7793a099>原始文本</label><textarea id="test-text" placeholder="输入要处理的文本内容..." class="test-text" rows="3" data-v-7793a099>${ssrInterpolate(testText.value)}</textarea></div></div></div><div class="results-section" data-v-7793a099><div class="results-header" data-v-7793a099><h2 data-v-7793a099>替换结果</h2><div class="results-actions" data-v-7793a099><button${ssrIncludeBooleanAttr(!resultText.value) ? " disabled" : ""} class="btn btn-primary" data-v-7793a099> 复制结果 </button><button${ssrIncludeBooleanAttr(!resultText.value) ? " disabled" : ""} class="btn btn-secondary" data-v-7793a099> 导出结果 </button><button${ssrIncludeBooleanAttr(!resultText.value) ? " disabled" : ""} class="btn btn-outline" data-v-7793a099> 交换文本 </button></div></div>`);
      if (matchCount.value > 0) {
        _push(`<div class="match-stats" data-v-7793a099><p data-v-7793a099>已替换 <strong data-v-7793a099>${ssrInterpolate(matchCount.value)}</strong> 个匹配项</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="result-text-container" data-v-7793a099><textarea placeholder="替换结果将显示在这里..." class="result-text" rows="3" readonly data-v-7793a099>${ssrInterpolate(resultText.value)}</textarea></div>`);
      if (regexError.value) {
        _push(`<div class="regex-error" data-v-7793a099><p data-v-7793a099>${ssrInterpolate(regexError.value)}</p></div>`);
      } else if (regex.value && testText.value && matchCount.value === 0) {
        _push(`<div class="no-matches" data-v-7793a099><p data-v-7793a099>没有找到匹配的内容</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="templates-section" data-v-7793a099><h2 data-v-7793a099>常用替换模板</h2><div class="templates-grid" data-v-7793a099><!--[-->`);
      ssrRenderList(templates, (template) => {
        _push(`<div class="template-item" data-v-7793a099><h3 data-v-7793a099>${ssrInterpolate(template.name)}</h3><div class="template-item-content" data-v-7793a099><div class="template-info" data-v-7793a099><div data-v-7793a099><strong data-v-7793a099>正则：</strong><code data-v-7793a099>${ssrInterpolate(template.pattern)}</code></div><div data-v-7793a099><strong data-v-7793a099>替换：</strong><code data-v-7793a099>${ssrInterpolate(template.replace)}</code></div></div></div></div>`);
      });
      _push(`<!--]--></div></div></div>`);
      _push(ssrRenderComponent(ProfileAside, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/regex/replace.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const replace = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7793a099"]]);

export { replace as default };
//# sourceMappingURL=replace-2pz8D8mT.mjs.map
