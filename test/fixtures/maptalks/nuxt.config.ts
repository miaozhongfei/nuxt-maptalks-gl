// 测试专用迷你 Nuxt 应用：仅为 @nuxt/test-utils 提供运行环境（#imports / runtimeConfig），不渲染演示页面。
export default defineNuxtConfig({
  // 安装本模块，使其 setup() 把配置注入 runtimeConfig.public.maptalksGl
  modules: ['../../../src/module'],
  // app.vue 放在 fixture 根目录
  srcDir: '.',
  // 写死测试所需的命名源与默认项，测试直接读模块注入的真实配置
  maptalksGl: {
    sources: {
      pubTile: {
        kind: 'public',
        type: 'tile',
        urlTemplate: 'https://example.com/{z}/{x}/{y}.png',
        options: { opacity: 1 },
      },
      signedTile: { kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' },
    },
    defaults: {
      lighting: { intensity: 0.6 },
      postProcess: { enable: true },
    },
  },
  compatibilityDate: '2025-06-10',
});
