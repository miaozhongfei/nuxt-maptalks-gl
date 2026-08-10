<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.49, 31.245]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 400px"
    >
      <!-- 3 个密集簇 × 7 个 UIMarker，collision 选项跟随 USwitch 响应式更新 -->
      <MaptalksUIMarker
        v-for="(m, i) in MARKERS"
        :key="i"
        :coordinates="m.coord"
        :options="mkOpts(m, i)"
      />
    </MaptalksMap>
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
    <p class="text-sm text-muted mt-2">MaptalksUIMarker 组件——碰撞开关响应式重建，簇内重叠时按权重隐藏低优先级（对应官网 10.9）。</p>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

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

const COLORS = ['#dc2626', '#2563eb', '#10b981']
function mkOpts(m: { label: string; weight: number }, idx: number): MaptalksUIMarkerOptions {
  return {
    content: `<div style="background:${COLORS[idx % 3]};color:#fff;padding:2px 6px;border-radius:3px;font-size:12px;white-space:nowrap">${m.label}</div>`,
    collision: collisionOn.value,
    collisionBufferSize: 2,
    collisionWeight: m.weight,
    collisionFadeIn: fadeInOn.value,
  }
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（UI 碰撞可切换）' : '加载中…'))
</script>
