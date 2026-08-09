<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <!-- 最近 8 条事件日志（新的在上） -->
    <ul class="text-xs font-mono mt-3 space-y-1">
      <li v-for="(line, i) in logs" :key="i" class="text-muted">{{ line }}</li>
    </ul>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 })
// 逃生舱：底图也用模块托管（osm 命名源），保持与其他 tab 视觉统一
useMaptalksTileLayer(map, { source: 'osm' })
const { layer } = useMaptalksVectorLayer(map)

const logs = ref<string[]>([])
// 环形日志：只保留最近 8 条
function push(name: string) {
  logs.value = [`${new Date().toLocaleTimeString()} ${name}`, ...logs.value].slice(0, 8)
}
// 逃生舱口径：工厂建 Marker，watch geometry ref 再 native on 绑定事件（on 已建模）
const { geometry } = useMaptalksGeometry(layer, (mt) => new mt.Marker([121.5057, 31.2453], {
  symbol: { markerType: 'ellipse', markerFill: '#2563eb', markerWidth: 18, markerHeight: 18 },
}))
watch(() => toValue(geometry), (g) => {
  if (!g) return
  g.on('click', () => push('click'))
  g.on('dblclick', () => push('dblclick'))
  g.on('mouseenter', () => push('mouseenter'))
  g.on('mouseout', () => push('mouseout'))
}, { immediate: true })

const status = computed(() => (isReady.value ? '地图已创建（几何事件监听中）' : '加载中…'))
</script>
