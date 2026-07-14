const isDev = import.meta.env.DEV;

export default defineNuxtConfig({
  modules: ['../../src/module'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: isDev },
  devServer: { port: 5022 },
  compatibilityDate: '2025-06-10',
  maptalksGl: {
    sources: {
      amap: {
        kind: 'public',
        type: 'tile',
        urlTemplate: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        options: {
          subdomains: ['1', '2', '3', '4'],
          attribution: '© 高德地图',
        },
      },
    },
    defaults: { camera: { center: [121.4737, 31.2304], zoom: 13 } },
  },
});
