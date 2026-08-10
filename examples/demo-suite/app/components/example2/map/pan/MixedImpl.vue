<template>
  <div>
    <!-- 组合：组件建图 + camera composable 平移 -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
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
// 组件与 composable 桥接
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const cam = useMaptalksCamera(map)

const status = computed(() => (map.value ? '地图已创建（panTo / panBy / setCenter 平移）' : '加载中…'))
</script>
