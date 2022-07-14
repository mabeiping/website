import { hopeTheme } from "vuepress-theme-hope";
// import { pwaPlugin } from "vuepress-plugin-pwa2";
import navbar from "./navbar";
import sidebar from "./sidebar";

const index_url = "https://mabeiping.github.io";
export default hopeTheme({
  themeColor: {
    blue: "#2196f3",
    green: "#3eaf7c",
    red: "#f26d6d",
    orange: "#fb9b5f",
  },
  //主机名字
  hostname: index_url,
  //作者
  author: {
    name: "小马哥",
    url: index_url,
  },
  iconAssets: "iconfont",
  editLink: false,
  logo: "/logo.svg",

  repo: "mabeiping/website",
  docsRepo: "mabeiping/website",
  docsBranch: "master",
  docsDir: "",

  // navbar
  navbar: navbar,
  sidebar: sidebar,
  footer: "",
  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  plugins: {
    blog: {
      autoExcerpt: true,
    },
    // comment: {
    //   provider: "Giscus",
    //   repo: "mabeiping/mabeiping.github.io",
    //   repoId: "R_kgDOHcCZqA",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOHcCZqM4CQIIW",
    // },
    pwa: true,

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
