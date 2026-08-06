<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm font-mono mt-3 text-muted">{{ resultText || '点击地图任意位置（原生 API 换算）' }}</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const resultText = ref('')
// 逃生舱：事件载荷自带 containerPoint（Point 实例），用原生方法反算回坐标（on 与 containerPointToCoordinate 均未建模，cast 兜底）
watch(
  () => toValue(map),
  (m) => {
    if (!m) return
    const raw = m as unknown as {
      on: (t: string, fn: (e: unknown) => void) => void
      containerPointToCoordinate: (p: unknown) => { x: number; y: number }
    }
    raw.on('click', (e) => {
      const ev = e as { coordinate?: { x: number; y: number }; containerPoint?: { x: number; y: number } }
      if (!ev.coordinate || !ev.containerPoint) return
      const back = raw.containerPointToCoordinate(ev.containerPoint)
      resultText.value =
        `原生：coordinate ${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}`
        + ` · containerPoint ${Math.round(ev.containerPoint.x)}, ${Math.round(ev.containerPoint.y)}`
        + ` · 反算 ${back.x.toFixed(5)}, ${back.y.toFixed(5)}`
    })
  },
)

const status = computed(() => (isReady.value ? '地图已创建（点击查看坐标转换）' : '加载中…'))
</script>
