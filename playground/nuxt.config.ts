const isDev = import.meta.env.DEV;

export default defineNuxtConfig({
  // 直接引用模块源码入口，改动 src 即时生效（无需先发布）
  modules: ['../src/module'],
  devtools: { enabled: isDev },
  sourcemap: { client: isDev, server: isDev },
  devServer: {
    // 与 playwright.config.ts 的 baseURL 端口保持一致
    port: 5000,
  },
  compatibilityDate: '2025-06-10',

  // 模块配置：命名数据源 + 默认相机
  maptalksGl: {
    sources: {
      // 公开源：CARTO basemaps（基于 OSM 数据，CDN 可达，与 maptalks 官网示例同源）
      osm: {
        kind: 'public',
        type: 'tile',
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        options: {
          subdomains: ['b', 'c', 'd'],
          attribution: '© OpenStreetMap contributors, © CARTO',
        },
      },
      // 签名源：经项目自有 server route 换取签名 URL（密钥不进前端）
      secure: {
        kind: 'signed',
        type: 'tile',
        endpoint: '/api/maptalks/sign',
      },
    },
    // 默认相机（上海人民广场）
    defaults: {
      camera: { center: [121.4737, 31.2304], zoom: 11 },
    },
  },
});
