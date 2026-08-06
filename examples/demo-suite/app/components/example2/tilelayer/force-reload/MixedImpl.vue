<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-3 mt-3">
      <UButton size="sm" @click="reload">强制重载</UButton>
      <UBadge color="primary" variant="subtle">已强制重载 {{ count }} 次</UBadge>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { layer } = useMaptalksTileLayer(map, {
  id: 'reload-layer',
  options: {
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['b', 'c', 'd'],
  },
})
const count = ref(0)

// forceReload 丢缓存重拉当前视野瓦片（forceReload 未建模，cast 兜底）
function reload() {
  (toValue(layer) as unknown as { forceReload?: () => void } | null)?.forceReload?.()
  count.value += 1
}

const status = computed(() => (map.value ? '地图已创建（可强制重载瓦片）' : '加载中…'))
</script>
