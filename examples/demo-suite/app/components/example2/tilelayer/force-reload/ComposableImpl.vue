<template>
  <div>
    <div
      ref="el"
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
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
const { layer } = useMaptalksTileLayer(map, { source: 'osm' })
const count = ref(0)

// forceReload 丢缓存重拉当前视野瓦片（layer 类型已收窄为 MaptalksTileLayer）
function reload() {
  toValue(layer)?.forceReload()
  count.value += 1
}

const status = computed(() => (isReady.value ? '地图已创建（可强制重载瓦片）' : '加载中…'))
</script>
