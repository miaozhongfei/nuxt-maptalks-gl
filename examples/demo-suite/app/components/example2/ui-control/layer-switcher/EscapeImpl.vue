<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">
      逃生舱——官网原生方式：GroupTileLayer 底图候选 + mt.control.LayerSwitcher，hover 切换（对应官网
      10.19）。
    </p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })

watch(
  () => toValue(map),
  (m) => { if (m) void init(m) },
  { immediate: true },
)

/** 地图就绪后：GroupTileLayer 底图 + 叠加标记图层 + LayerSwitcher 控件 */
async function init(m: unknown): Promise<void> {
  const mt = await import('maptalks-gl')
  if (!mt.control?.LayerSwitcher) return
  const gtl = buildBaseLayers(mt)
  ;(m as { setBaseLayer: (l: unknown) => void }).setBaseLayer(gtl)
  addMarkerLayer(m, mt, 'Vector Markers', '#2563eb', [[121.5057, 31.2453], [121.5157, 31.2453], [121.5157, 31.2353]])
  addMarkerLayer(m, mt, 'Circle Markers', '#dc2626', [[121.4957, 31.2453], [121.4957, 31.2353], [121.4957, 31.2553]])
  // LayerSwitcher 控件
  new mt.control.LayerSwitcher({
    position: 'top-right',
    baseTitle: 'Base Layers',
    overlayTitle: 'Layers',
    excludeLayers: [],
    containerClass: 'maptalks-layer-switcher',
  }).addTo(m as never)
}

/** GroupTileLayer 底图：Carto light 可见 / Carto dark 隐藏（LayerSwitcher 自动列为候选） */
function buildBaseLayers(mt: any): unknown {
  return new mt.GroupTileLayer('Base TileLayer', [
    new mt.TileLayer('Carto light', {
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    }),
    new mt.TileLayer('Carto dark', {
      visible: false,
      urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      subdomains: ['a', 'b', 'c', 'd'],
    }),
  ])
}

/** 叠加标记图层（LayerSwitcher 的 Layers 分组） */
function addMarkerLayer(m: unknown, mt: any, id: string, fill: string, coords: number[][]): void {
  new mt.VectorLayer(
    id,
    coords.map(
      (c) =>
        new mt.Marker(c, {
          symbol: { markerType: 'ellipse', markerFill: fill, markerWidth: 20, markerHeight: 20 },
        }),
    ),
  ).addTo(m as never)
}

const status = computed(() => (isReady.value ? '地图已创建（LayerSwitcher 可用）' : '加载中…'))
</script>
