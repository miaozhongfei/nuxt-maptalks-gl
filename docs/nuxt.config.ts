// https://nuxt.com/docs/api/configuration/nuxt-config

const isDev = import.meta.env.DEV;

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/content', '@nuxtjs/color-mode'],
  // 禁用 Google Fonts 自动下载（国内网络不可达）；Nuxt UI v4 字体管理委托给 @nuxt/fonts
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
  devtools: { enabled: isDev },
  devServer: {
    // 与 playground（5000）错开，避免端口冲突
    port: 5010,
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-06-10',
  // GitHub Pages 部署：项目站点 /nuxt-maptalks-gl/ 为应用基础路径
  app: {
    baseURL: '/nuxt-maptalks-gl/',
  },
  // Nuxt Content v3：原生 SQLite + 禁用自动 contentHeading（由 [...slug].vue 手动渲染 title/description）
  content: {
    build: { markdown: { contentHeading: false } },
    experimental: { sqliteConnector: 'native' },
  },
  i18n: {
    locales: [
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
      { code: 'fa', language: 'fa-IR', name: 'Farsi', file: 'fa.json', dir: 'rtl' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'zh',
  },
  // 预打包运行时发现的新依赖，避免 HMR 时页面全量刷新
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit'],
    },
  },
  // 静态生成：从各语言入口爬取所有链接，预渲染全部内容页
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/en', '/fa'],
    },
  },
});
