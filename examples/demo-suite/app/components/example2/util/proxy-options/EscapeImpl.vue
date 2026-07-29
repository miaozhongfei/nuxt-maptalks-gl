<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3 flex-wrap">
      <UButton size="sm" variant="outline" @click="setZoom(12)">
        设为 zoom=12
      </UButton>
      <UButton size="sm" variant="outline" @click="setZoom(15)">
        设为 zoom=15
      </UButton>
      <UBadge variant="subtle">当前 zoom={{ currentZoom }}</UBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const { map } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 13 });
useMaptalksTileLayer(map, { source: 'osm' });

const currentZoom = ref(13);

function setZoom(z: number) {
  const m = toValue(map)
  if (!m) return
  // 逃生舱直调 map.config() 运行时热更新 zoom（不更新模块 options 快照）
  m.config({ zoom: z })
  currentZoom.value = z
}
</script>
