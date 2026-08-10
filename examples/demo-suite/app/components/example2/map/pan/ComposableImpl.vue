<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3 flex-wrap">
      <UButton size="sm" @click="cam.panTo([121.4906, 31.2397])">panTo 外滩</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.panBy([150, 0])">panBy 右移 150px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="cam.panBy([0, -120])">panBy 上移 120px</UButton>
      <UButton size="sm" color="neutral" variant="outline" @click="() => { cam.center.value = { x: 121.52, y: 31.235 } }">setCenter 瞬移</UButton>
      <UButton size="sm" color="neutral" @click="cam.panTo([121.5057, 31.2453])">回到原点</UButton>
      <span class="text-sm text-muted">
        中心：{{ (cam.center.value?.x ?? 0).toFixed(4) }}, {{ (cam.center.value?.y ?? 0).toFixed(4) }}
      </span>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })
// panTo / panBy 由 camera composable 提供；center ref 实时回流
const cam = useMaptalksCamera(map)

const status = computed(() => (isReady.value ? '地图已创建（panTo / panBy / setCenter 平移）' : '加载中…'))
</script>
