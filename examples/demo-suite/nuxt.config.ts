const isDev = import.meta.env.DEV;

export default defineNuxtConfig({
  modules: ['../../src/module', '@nuxt/ui'],
  // 禁用 Google Fonts 自动下载（国内网络不可达）
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: isDev },
  devServer: { port: 5021 },
  compatibilityDate: '2025-06-10',
  // 命名数据源：osm 公开底图 + secure 签名底图（同 playground）
  maptalksGl: {
    sources: {
      osm: {
        kind: 'public',
        type: 'tile',
        urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        options: {
          subdomains: ['b', 'c', 'd'],
          attribution: '© OpenStreetMap contributors, © CARTO',
        },
      },
      secure: { kind: 'signed', type: 'tile', endpoint: '/api/maptalks/sign' },
    },
    defaults: { camera: { center: [121.4737, 31.2304], zoom: 11 } },
  },
  // 排除顶层访问 document/window 的包，防止 Vite 预打包崩溃
  vite: {
    optimizeDeps: {
      exclude: ['maptalks.three', 'maptalks.markercluster'],
    },
  },
});
