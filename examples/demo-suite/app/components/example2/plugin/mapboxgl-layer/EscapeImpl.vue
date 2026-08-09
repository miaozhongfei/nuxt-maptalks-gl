<template>
  <div>
    <div ref="el" class="relative rounded border border-default overflow-hidden" style="height: 480px" />
    <p class="text-sm text-muted mt-2">逃生舱——插件 README 原生用法：import maptalks.mapboxgl → new MapboxglLayer(...).addTo(map)（对应官网 12.1）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
// oxlint-disable-next-line import/no-unassigned-import -- mapbox-gl 必需样式（插件不自动携带）
import 'mapbox-gl/dist/mapbox-gl.css'

const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13, baseLayer: 'osm' })

const pluginReady = ref(false)
watch(
  () => toValue(map),
  async (m) => {
    if (!m) return
    // mapbox-gl v1 每帧校验 token（无效 token 仅 fire 错误不影响渲染），静默避免控制台噪音；
    // carto 公共样式为自定义 URL 实际不消费 token，占位即可
    // 无类型插件模块：as string 使 TS 不静态解析（避免 ts-plugin 7016），Vite 转换后仍是字面量 import 正常预打包
    const mapboxgl: any = await import('mapbox-gl' as string)
    mapboxgl.accessToken = 'pk.placeholder'
    mapboxgl.Map.prototype['_silenceAuthErrors'] = true
    // 插件 README 用法：import 插件模块后直接用其导出的 MapboxglLayer 类（extends maptalks.Layer）
    const { MapboxglLayer }: any = await import('maptalks.mapboxgl' as string)
    if (!MapboxglLayer) return
    new MapboxglLayer('mbgl', {
      glOptions: { style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' },
    }).addTo(m as never)
    pluginReady.value = true
  },
  { immediate: true },
)

const status = computed(() => (isReady.value && pluginReady.value ? '地图已创建（MapboxglLayer 已加载）' : '加载中…'))
</script>
