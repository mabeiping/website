import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/":[
    // { text: "最近更新",prefix: "/lastest/", link: "/lastest/",collapsable:true, children: "structure" },
    { text: "起承转合",prefix: "/qi_cheng_zhuan_he/", link: "/qi_cheng_zhuan_he/",collapsable:true, children: "structure" },
    { text: "神态动作",prefix: "/shen_tai_dong_zuo/", link: "/shen_tai_dong_zuo/",collapsable:true, children: "structure" },
    { text: "人物画像",prefix: "/ren_wu_hua_xiang/", link: "/ren_wu_hua_xiang/",collapsable:true, children: "structure" },
    { text: "荤素搭配",prefix: "/hun_su_da_pei/", link: "/hun_su_da_pei/",collapsable:true, children: "structure" },
    { text: "关于本站",prefix: "/about/", link: "/about/",collapsable:true, children: "structure" },],
  "/qi_cheng_zhuan_he/": "structure",
  "/shen_tai_dong_zuo/": "structure",
  "/ren_wu_hua_xiang/": "structure",
  "/hun_su_da_pei/": "structure",
  "/about/": "structure",
  
  // { text: "如何使用小说",prefix: "/小说/", link: "/小说/",collapsable:true, children: "structure" },
  // { text: "如何使用心理",prefix: "/心理/", link: "/心理/",collapsable:true, children: "structure" },
  // { text: "如何使用励志",prefix: "/励志/", link: "/励志/",collapsable:true, children: "structure" },
  // { text: "如何使用软件",prefix: "/软件/", link: "/软件/",collapsable:true, children: "structure" },
  // { text: "如何使用关于",prefix: "/关于/", link: "/关于/",collapsable:true, children: "structure" },
  // "/": "structure",
});
