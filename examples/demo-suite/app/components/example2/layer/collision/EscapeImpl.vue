<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
      <input type="checkbox" v-model="collisionOn" class="w-4 h-4" />
      <span class="text-sm">collision</span>
    </label>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 8 })
useMaptalksTileLayer(map, { source: 'osm' })

const collisionOn = ref(true)

// 原生 VectorLayer 构造赋建模 MaptalksVectorLayer 逆变不兼容——工厂内断言（useMaptalksLayer 泛型显式化）
const { layer } = useMaptalksLayer(
  map,
  (mt) => new mt.VectorLayer('collision-layer', {
    collision: true,
    collisionDelay: 250,
    forceRenderOnMoving: true,
    forceRenderOnZooming: true,
    forceRenderOnRotating: true,
  }) as unknown as MaptalksVectorLayer,
)

const randomMarkers = Array.from(
  { length: 100 },
  () => [121.49 + Math.random() * 0.03, 31.22 + Math.random() * 0.05] as [number, number],
)

randomMarkers.forEach((c, i) => {
  useMaptalksGeometry(
    layer,
    (mt) =>
      new mt.Marker(c, {
        symbol: {
          markerType: 'ellipse',
          markerFill: '#2563eb',
          markerWidth: 28,
          markerHeight: 28,
          textName: String(i),
          textSize: 12,
          textDy: -26,
          textFill: '#2563eb',
        },
        id: String(i),
      }),
  )
})

watch(collisionOn, (checked) => {
  const l = toValue(layer)
  if (!l) return
  l.getGeometries().forEach((m) => {
    m.config({
      collision: checked,
    })
  })
  // getRenderer 已建模返回 unknown——renderer 的 draw 强制重绘逃生舱断言（内部结构未建模）
  ;(l.getRenderer() as { draw(): void }).draw()
})

const status = computed(() => (isReady.value ? '地图已创建（可切换碰撞避让）' : '加载中…'))
</script>
