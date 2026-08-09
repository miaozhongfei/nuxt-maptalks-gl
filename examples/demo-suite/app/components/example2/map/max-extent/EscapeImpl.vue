<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="setLimit">原生 new Extent + setMaxExtent</UButton>
      <UButton size="sm" color="neutral" @click="clearLimit">解除限制</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

// 逃生舱：动态 import 拿命名空间，new 原生 Extent（setMaxExtent 已建模）
function setLimit() {
  const m = toValue(map)
  if (!m) return
  void import('maptalks-gl').then((mt) => {
    m.setMaxExtent(new mt.Extent(121.47, 31.22, 121.55, 31.27))
  })
}
function clearLimit() {
  toValue(map)?.setMaxExtent(null)
}

const status = computed(() => (isReady.value ? '地图已创建（原生 maxExtent 限制）' : '加载中…'))
</script>
