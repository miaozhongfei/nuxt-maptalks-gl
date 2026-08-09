<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm text-muted mt-2">逃生舱——模块未封装的 Toolbar 控件用原生 API 补齐（右上角）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

// 逃生舱：动态 import maptalks-gl，new 原生控件（control.Zoom / Toolbar 均已建模）
watch(
  () => toValue(map),
  (m) => {
    if (!m) return
    void import('maptalks-gl').then((mt) => {
      // addTo 参数为 maptalks 原生 Map 类型，模块 MaptalksMap 结构不匹配，as never 兜底；
      // 原生构造器直接收 position（无模块的 options 包裹层）
      new mt.control.Zoom({ position: 'top-left' }).addTo(m as never)
      new mt.control.Toolbar({
        position: 'top-right',
        items: [
          { item: '放大', click: () => m.zoomIn() },
          { item: '缩小', click: () => m.zoomOut() },
        ],
      }).addTo(m as never)
    })
  },
)

const status = computed(() => (isReady.value ? '地图已创建（原生 Zoom + Toolbar 控件）' : '加载中…'))
</script>
