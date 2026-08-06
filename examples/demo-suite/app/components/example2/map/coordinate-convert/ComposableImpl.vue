<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm font-mono mt-3 text-muted">{{ resultText || '点击地图任意位置查看坐标转换结果' }}</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

// 坐标换算 composable：经纬度 ↔ 容器像素
const coord = useMaptalksCoordinate()
const resultText = ref('')
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } }
    const m = map.value
    if (!m || !ev.coordinate) return
    // 经纬度 → 容器像素（返回 unknown，断言原生 Point 结构）
    const pt = coord.toContainerPoint(m, ev.coordinate) as { x: number; y: number }
    // 容器像素 → 经纬度（反算验证）
    const back = coord.toCoordinate(m, { x: pt.x, y: pt.y }) as { x: number; y: number }
    resultText.value =
      `经纬度 ${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}`
      + ` → 像素 ${Math.round(pt.x)}, ${Math.round(pt.y)}`
      + ` → 反算 ${back.x.toFixed(5)}, ${back.y.toFixed(5)}`
  },
})

const status = computed(() => (isReady.value ? '地图已创建（点击查看坐标转换）' : '加载中…'))
</script>
