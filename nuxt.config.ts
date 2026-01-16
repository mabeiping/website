// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 3000
  },
  site: {
    url: 'https://yourwebsite.com',
    name: '实用工具集',
    description: '提供多种实用工具，包括办公工具、前端开发工具和游戏娱乐',
    defaultLocale: 'zh-CN'
  },
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],
  nitro: {
    prerender: {
      failOnError: false,
      crawlLinks: true,
      routes: [
        '/',
        '/office',
        '/frontend',
        '/games'
      ]
    }
  },
  sitemap: {
    gzip: true,
    exclude: []
  },
  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Disallow: ''
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '实用工具集 - 提供多种实用工具，包括办公工具、前端开发工具和游戏娱乐' },
        { name: 'keywords', content: '实用工具,办公工具,前端开发,游戏娱乐' },
        { name: 'author', content: '实用工具集' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: '实用工具集' },
        { property: 'og:description', content: '提供多种实用工具，包括办公工具、前端开发工具和游戏娱乐' },
        { property: 'og:site_name', content: '实用工具集' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '实用工具集' },
        { name: 'twitter:description', content: '提供多种实用工具，包括办公工具、前端开发工具和游戏娱乐' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  }
})
