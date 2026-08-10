<template>
  <div>
    <!-- 组合：组件建图 + 坐标/事件 composable -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <p class="text-sm font-mono mt-3 text-muted">{{ resultText || '点击地图任意位置查看坐标转换结果' }}</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const coord = useMaptalksCoordinate()
const resultText = ref('')
useMaptalksEvents(map, {
  click: (e) => {
    const ev = e as { coordinate?: { x: number; y: number } }
    const m = map.value
    if (!m || !ev.coordinate) return
    const pt = coord.toContainerPoint(m, ev.coordinate) as { x: number; y: number }
    // 反算验证：像素 → 经纬度
    const back = coord.toCoordinate(m, { x: pt.x, y: pt.y }) as { x: number; y: number }
    resultText.value =
      `经纬度 ${ev.coordinate.x.toFixed(5)}, ${ev.coordinate.y.toFixed(5)}`
      + ` → 像素 ${Math.round(pt.x)}, ${Math.round(pt.y)}`
      + ` → 反算 ${back.x.toFixed(5)}, ${back.y.toFixed(5)}`
  },
})

const status = computed(() => (map.value ? '地图已创建（点击查看坐标转换）' : '加载中…'))
</script>
