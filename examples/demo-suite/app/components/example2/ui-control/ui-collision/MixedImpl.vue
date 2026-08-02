<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.49, 31.245]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    />
    <div class="mt-3 flex items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-sm">碰撞检测 collision</span>
        <USwitch v-model="collisionOn" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm">碰撞淡入 collisionFadeIn</span>
        <USwitch v-model="fadeInOn" />
      </div>
    </div>
    <p class="text-sm text-muted mt-2">MaptalksMap ref + useMaptalksUIMarker 循环——options getter 响应式重建（对应官网 10.9）。</p>
  </div>
</template>

<script setup lang="ts">
// 3 个密集簇：每簇 7 个坐标相近的 UIMarker（簇间分离）
const CLUSTERS: [number, number][][] = [
  Array.from({ length: 7 }, (_, i) => [121.5057 + i * 0.001, 31.2453 + (i % 3) * 0.001] as [number, number]),
  Array.from({ length: 7 }, (_, i) => [121.49 + i * 0.001, 31.24 + (i % 3) * 0.001] as [number, number]),
  Array.from({ length: 7 }, (_, i) => [121.47 + i * 0.001, 31.235 + (i % 3) * 0.001] as [number, number]),
]
const MARKERS = CLUSTERS.flatMap((cluster, ci) =>
  cluster.map((coord, i) => ({ coord, label: `簇${ci + 1}-${i + 1}`, weight: (i % 3) + 1 })),
)

const collisionOn = ref(true)
const fadeInOn = ref(true)

const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)

const COLORS = ['#dc2626', '#2563eb', '#10b981']
MARKERS.forEach((m, idx) => {
  useMaptalksUIMarker(map, {
    options: () => ({
      content: `<div style="background:${COLORS[idx % 3]};color:#fff;padding:2px 6px;border-radius:3px;font-size:12px;white-space:nowrap">${m.label}</div>`,
      collision: collisionOn.value,
      collisionBufferSize: 2,
      collisionWeight: m.weight,
      collisionFadeIn: fadeInOn.value,
      coordinates: m.coord,
    }),
  })
})
</script>
