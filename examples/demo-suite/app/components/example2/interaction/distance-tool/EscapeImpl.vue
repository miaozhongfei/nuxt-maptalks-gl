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

// 逃生舱：map 就绪后直调原生 maptalks.DistanceTool，不依赖模块 wrapper
type RawDistanceTool = { addTo: (m: Record<string, unknown>) => void }
type RawMt = { DistanceTool?: new (opts?: Record<string, unknown>) => RawDistanceTool }

watch(
  () => toValue(map),
  (m) => {
    if (!m) return
    import('maptalks-gl').then((mt) => {
      const Ctor = (mt as RawMt).DistanceTool
      if (Ctor) new Ctor({}).addTo(m)
    })
  },
  { once: true },
)

const status = computed(() => (isReady.value ? '地图已创建（点击地图测距）' : '加载中…'))
</script>
