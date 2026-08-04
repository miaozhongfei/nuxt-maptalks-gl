<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksLayer 通用原语 + maptalks.mapboxgl 插件——MapboxglLayer GL 栅格图层（对应官网 12.1）。</p>
  </div>
</template>

<script setup lang="ts">
// oxlint-disable-next-line import/no-unassigned-import -- mapbox-gl 必需样式（插件不自动携带）
import 'mapbox-gl/dist/mapbox-gl.css'

// MaptalksMap ref 桥接：组件实例取 map 后经通用图层原语消费插件构造器
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

// 插件构造器按需加载（maptalks.mapboxgl 的 MapboxglLayer，extends maptalks.Layer 与 maptalks-gl 同源）
const MapboxglLayerCtor = ref<any>(null)
watch(
  map,
  async (m) => {
    if (!m || MapboxglLayerCtor.value) return
    // mapbox-gl v1 每帧校验 token（无效 token 仅 fire 错误不影响渲染），静默避免控制台噪音；
    // carto 公共样式为自定义 URL 实际不消费 token，占位即可
    const mapboxgl: any = await import('mapbox-gl')
    mapboxgl.accessToken = 'pk.placeholder'
    mapboxgl.Map.prototype['_silenceAuthErrors'] = true
    const mod: any = await import('maptalks.mapboxgl')
    MapboxglLayerCtor.value = mod.MapboxglLayer
  },
  { immediate: true },
)

// enabled 门控等插件模块就绪后再创建（carto 公共 GL 样式，免 token）
const { layer } = useMaptalksLayer(
  map,
  () => new MapboxglLayerCtor.value('mbgl', { glOptions: { style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json' } }),
  { enabled: MapboxglLayerCtor },
)
</script>
