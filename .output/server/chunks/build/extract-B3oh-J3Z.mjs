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
  __name: "extract",
  __ssrInlineRender: true,
  setup(__props) {
    const regex = ref("");
    const testText = ref("");
    const flags = ref({
      g: true,
      i: false,
      m: false
    });
    const matches = ref([]);
    const regexError = ref("");
    const templates = [
      {
        id: "phone",
        name: "手机号码",
        pattern: "1[3-9]\\d{9}",
        description: "匹配中国大陆手机号码"
      },
      {
        id: "email",
        name: "电子邮箱",
        pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
        description: "匹配电子邮箱地址"
      },
      {
        id: "url",
        name: "网址URL",
        pattern: "https?:\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?",
        description: "匹配HTTP/HTTPS网址"
      },
      {
        id: "date",
        name: "日期格式",
        pattern: "\\d{4}-\\d{2}-\\d{2}",
        description: "匹配YYYY-MM-DD日期格式"
      },
      {
        id: "time",
        name: "时间格式",
        pattern: "([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?",
        description: "匹配HH:MM或HH:MM:SS时间格式"
      },
      {
        id: "ip",
        name: "IP地址",
        pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b",
        description: "匹配IPv4地址"
      },
      {
        id: "idcard",
        name: "身份证号",
        pattern: "[1-9]\\d{5}(?:18|19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]",
        description: "匹配18位身份证号码"
      },
      {
        id: "number",
        name: "数字(整数/小数)",
        pattern: "-?\\d+(\\.\\d+)?",
        description: "匹配整数或小数"
      },
      {
        id: "zipcode",
        name: "邮政编码",
        pattern: "\\d{6}",
        description: "匹配6位邮政编码"
      },
      {
        id: "qq",
        name: "QQ号",
        pattern: "[1-9][0-9]{4,10}",
        description: "匹配5-11位QQ号"
      },
      {
        id: "wechat",
        name: "微信号",
        pattern: "[a-zA-Z][-_a-zA-Z0-9]{5,19}",
        description: "匹配微信号（字母开头，6-20位）"
      },
      {
        id: "chinese",
        name: "中文字符",
        pattern: "[\\u4e00-\\u9fa5]+",
        description: "匹配中文字符"
      },
      {
        id: "chinese-name",
        name: "中文姓名",
        pattern: "[\\u4e00-\\u9fa5]{2,4}",
        description: "匹配中文姓名（2-4个汉字）"
      },
      {
        id: "english-word",
        name: "英文单词",
        pattern: "\\b[a-zA-Z]+\\b",
        description: "匹配英文单词"
      },
      {
        id: "hex-color",
        name: "十六进制颜色",
        pattern: "#[0-9a-fA-F]{3,6}",
        description: "匹配十六进制颜色代码"
      },
      {
        id: "mac-address",
        name: "MAC地址",
        pattern: "([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})",
        description: "匹配MAC地址"
      },
      {
        id: "port",
        name: "端口号",
        pattern: "([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])",
        description: "匹配有效端口号（1-65535）"
      },
      {
        id: "username",
        name: "用户名",
        pattern: "[a-zA-Z0-9_]{3,16}",
        description: "匹配用户名（3-16位字母数字下划线）"
      },
      {
        id: "password",
        name: "密码强度",
        pattern: "(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}",
        description: "匹配至少8位包含字母和数字的密码"
      },
      {
        id: "bank-card",
        name: "银行卡号",
        pattern: "\\d{16,19}",
        description: "匹配16-19位银行卡号"
      },
      {
        id: "license-plate",
        name: "车牌号",
        pattern: "[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{5}",
        description: "匹配中国大陆车牌号"
      },
      {
        id: "uuid",
        name: "UUID",
        pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
        description: "匹配UUID格式"
      },
      {
        id: "file-extension",
        name: "文件扩展名",
        pattern: "\\.[a-zA-Z0-9]{2,4}$",
        description: "匹配文件扩展名"
      },
      {
        id: "version",
        name: "版本号",
        pattern: "\\d+\\.\\d+\\.\\d+",
        description: "匹配版本号格式（如1.0.0）"
      },
      {
        id: "percentage",
        name: "百分比",
        pattern: "\\d+(\\.\\d+)?%",
        description: "匹配百分比格式"
      },
      {
        id: "file-path",
        name: "文件路径",
        pattern: '^[a-zA-Z]:\\\\(?:[^\\\\/:*?"<>|]+\\\\)*[^\\\\/:*?"<>|]*$',
        description: "匹配Windows文件路径"
      },
      {
        id: "ipv6",
        name: "IPv6地址",
        pattern: "(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})",
        description: "匹配IPv6地址"
      },
      {
        id: "domain",
        name: "域名",
        pattern: "([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}",
        description: "匹配域名"
      },
      {
        id: "money",
        name: "金额",
        pattern: "￥\\d{1,3}(,\\d{3})*(\\.\\d{2})?",
        description: "匹配人民币金额（带千分位）"
      }
    ];
    watch([regex, testText, flags], () => {
      updateMatches();
    }, { deep: true });
    const updateMatches = () => {
      matches.value = [];
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
        let result;
        if (flags.value.g) {
          let match;
          while ((match = regexObj.exec(testText.value)) !== null) {
            matches.value.push(match[0]);
            if (match.index === regexObj.lastIndex) {
              regexObj.lastIndex++;
            }
          }
        } else {
          result = regexObj.exec(testText.value);
          if (result) {
            matches.value.push(result[0]);
          }
        }
      } catch (error) {
        regexError.value = `正则表达式错误: ${error.message}`;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-container" }, _attrs))} data-v-d6d7d4f9><div class="regex-page" data-v-d6d7d4f9><div class="page-header" data-v-d6d7d4f9><h1 class="page-title" data-v-d6d7d4f9>正则表达式提取工具</h1><div class="tool-description" data-v-d6d7d4f9><p data-v-d6d7d4f9>使用正则表达式从文本中提取匹配的内容，支持实时预览和多种导出选项。</p></div></div><div class="main-function-area" data-v-d6d7d4f9><div class="input-section" data-v-d6d7d4f9><div class="input-row" data-v-d6d7d4f9><div class="input-group" data-v-d6d7d4f9><label for="regex-input" data-v-d6d7d4f9>正则表达式</label><div class="regex-input-container" data-v-d6d7d4f9><input type="text" id="regex-input"${ssrRenderAttr("value", regex.value)} placeholder="输入正则表达式，如：\\d{3}-\\d{3}-\\d{4}" class="regex-input" data-v-d6d7d4f9><div class="regex-flags" data-v-d6d7d4f9><label data-v-d6d7d4f9><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.g) ? ssrLooseContain(flags.value.g, null) : flags.value.g) ? " checked" : ""} id="global-flag" data-v-d6d7d4f9> g (全局匹配)</label><label data-v-d6d7d4f9><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.i) ? ssrLooseContain(flags.value.i, null) : flags.value.i) ? " checked" : ""} id="ignorecase-flag" data-v-d6d7d4f9> i (忽略大小写)</label><label data-v-d6d7d4f9><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value.m) ? ssrLooseContain(flags.value.m, null) : flags.value.m) ? " checked" : ""} id="multiline-flag" data-v-d6d7d4f9> m (多行模式)</label></div></div></div></div><div class="input-row" data-v-d6d7d4f9><div class="input-group full-width" data-v-d6d7d4f9><label for="test-text" data-v-d6d7d4f9>测试文本</label><textarea id="test-text" placeholder="输入要匹配的文本内容..." class="test-text" rows="3" data-v-d6d7d4f9>${ssrInterpolate(testText.value)}</textarea></div></div></div><div class="results-section" data-v-d6d7d4f9><div class="results-header" data-v-d6d7d4f9><h2 data-v-d6d7d4f9>匹配结果</h2><div class="results-actions" data-v-d6d7d4f9><button${ssrIncludeBooleanAttr(!matches.value.length) ? " disabled" : ""} class="btn btn-primary" data-v-d6d7d4f9> 复制所有结果 </button><button${ssrIncludeBooleanAttr(!matches.value.length) ? " disabled" : ""} class="btn btn-secondary" data-v-d6d7d4f9> 导出结果 </button></div></div>`);
      if (matches.value.length > 0) {
        _push(`<div class="match-stats" data-v-d6d7d4f9><p data-v-d6d7d4f9>找到 <strong data-v-d6d7d4f9>${ssrInterpolate(matches.value.length)}</strong> 个匹配项</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (matches.value.length > 0) {
        _push(`<div class="match-results" data-v-d6d7d4f9><!--[-->`);
        ssrRenderList(matches.value, (match, index) => {
          _push(`<div class="match-item" data-v-d6d7d4f9><div class="match-header" data-v-d6d7d4f9><span class="match-index" data-v-d6d7d4f9>匹配 #${ssrInterpolate(index + 1)}</span><button class="btn btn-small" data-v-d6d7d4f9> 复制 </button></div><div class="match-content" data-v-d6d7d4f9><pre data-v-d6d7d4f9>${ssrInterpolate(match)}</pre></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (regex.value && testText.value) {
        _push(`<div class="no-matches" data-v-d6d7d4f9><p data-v-d6d7d4f9>没有找到匹配的内容</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (regexError.value) {
        _push(`<div class="regex-error" data-v-d6d7d4f9><p data-v-d6d7d4f9>${ssrInterpolate(regexError.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="templates-section" data-v-d6d7d4f9><h2 data-v-d6d7d4f9>常用正则表达式模板</h2><div class="templates-grid" data-v-d6d7d4f9><!--[-->`);
      ssrRenderList(templates, (template) => {
        _push(`<div class="template-item" data-v-d6d7d4f9><h3 data-v-d6d7d4f9>${ssrInterpolate(template.name)}</h3><div data-v-d6d7d4f9><code data-v-d6d7d4f9>${ssrInterpolate(template.pattern)}</code></div></div>`);
      });
      _push(`<!--]--></div></div><div class="rules-section" data-v-d6d7d4f9><h2 data-v-d6d7d4f9>正则表达式基础规则</h2><div class="rules-list" data-v-d6d7d4f9><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>.</code> - 匹配任意单个字符（除换行符）</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>\\d</code> - 匹配任意数字</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>\\w</code> - 匹配任意字母、数字或下划线</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>\\s</code> - 匹配任意空白字符</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>^</code> - 匹配字符串开头</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>$</code> - 匹配字符串结尾</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>*</code> - 匹配前面的表达式 0 次或多次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>+</code> - 匹配前面的表达式 1 次或多次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>?</code> - 匹配前面的表达式 0 次或 1 次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>{n}</code> - 匹配前面的表达式恰好 n 次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>{n,}</code> - 匹配前面的表达式至少 n 次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>{n,m}</code> - 匹配前面的表达式 n 到 m 次</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>[abc]</code> - 匹配方括号内的任意一个字符</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>[^abc]</code> - 匹配除方括号内字符以外的任意字符</div><div class="rule-item" data-v-d6d7d4f9><code data-v-d6d7d4f9>(x|y)</code> - 匹配 x 或 y</div></div></div></div>`);
      _push(ssrRenderComponent(ProfileAside, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/regex/extract.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const extract = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d6d7d4f9"]]);

export { extract as default };
//# sourceMappingURL=extract-B3oh-J3Z.mjs.map
