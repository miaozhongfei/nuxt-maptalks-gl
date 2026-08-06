<template>
  <div>
    <!-- 组合：组件建图 + export composable -->
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="14"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    />
    <div class="flex items-center gap-2 mt-3">
      <UButton size="sm" @click="preview">预览截图</UButton>
      <UButton size="sm" color="neutral" @click="download('map-mixed.png')">下载 PNG</UButton>
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
const mc = ref<MaptalksMapExposed | null>(null)
const map = computed(() => toValue(mc.value?.map) ?? null)
const { toDataURL, download } = useMaptalksExport(map)
const dataUrl = ref<string | null>(null)
function preview() {
  dataUrl.value = toDataURL({ mimeType: 'image/png' })
}

const status = computed(() => (map.value ? '地图已创建（可导出 PNG）' : '加载中…'))
</script>
