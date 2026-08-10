<template>
  <div>
    <div
      ref="el"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="preview">预览截图</UButton>
      <UButton size="sm" color="neutral" @click="exportNative">下载 PNG（原生）</UButton>
    </div>
    <img
      v-if="dataUrl"
      :src="dataUrl"
      alt="地图截图预览"
      class="mt-3 rounded border border-default max-h-60"
    >
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
const { map, isReady } = useMaptalks(el, { center: [121.5057, 31.2453], zoom: 14 })
useMaptalksTileLayer(map, { source: 'osm' })

const dataUrl = ref<string | null>(null)
// 预览：原生 toDataURL 展示截图（toDataURL 已建模）
function preview() {
  dataUrl.value = map.value?.toDataURL({ mimeType: 'image/png' }) ?? null
}
// 逃生舱：原生 toDataURL + 手工 <a download>
function exportNative() {
  const url = map.value?.toDataURL({ mimeType: 'image/png' })
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = 'map-native.png'
  a.click()
}

const status = computed(() => (isReady.value ? '地图已创建（可导出 PNG）' : '加载中…'))
</script>
