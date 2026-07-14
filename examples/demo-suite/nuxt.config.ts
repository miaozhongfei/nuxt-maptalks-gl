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
  // 插件包排除预打包（esbuild 会破坏 CJS class 构造函数 new 语义）
  // 这些包由 Vite dev server 按原始 ESM/CJS 服务，配合 optimizeDeps 中 maptalks-gl 的预构建
  vite: {
    optimizeDeps: {
      exclude: ['maptalks.heatmap', 'maptalks.markercluster', 'maptalks.three', 'maptalks.e3', 'maptalks.mapboxgl'],
      include: [],
    },
  },
});
