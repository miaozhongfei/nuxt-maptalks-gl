<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
useMaptalksTileLayer(map, { source: 'osm' })

// 逃生舱：map 就绪后直调原生 maptalks.AreaTool，不依赖模块 wrapper
type RawAreaTool = { addTo: (m: Record<string, unknown>) => void }
type RawMt = { AreaTool?: new (opts?: Record<string, unknown>) => RawAreaTool }

watch(
  () => toValue(map),
  (m) => {
    if (!m) return
    import('maptalks-gl').then((mt) => {
      // 原生 AreaTool.addTo(map: Map) 与窄类型签名逆变不兼容——双重断言
      const Ctor = (mt as unknown as RawMt).AreaTool
      if (Ctor) new Ctor({}).addTo(m)
    })
  },
  { once: true },
)

const status = computed(() => (isReady.value ? '地图已创建（点击地图测面积）' : '加载中…'))
</script>
