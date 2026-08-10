<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker :coordinates="[121.5057, 31.2453]" :options="{ symbol: { ...sym } }" />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <div class="mt-3 flex gap-2">
      <UButton size="sm" color="error" @click="setColor('#dc2626')">切换红色</UButton>
      <UButton size="sm" color="primary" @click="setColor('#2563eb')">切换蓝色</UButton>
    </div>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
const sym = reactive({
  markerType: 'ellipse',
  markerFill: '#2563eb',
  markerWidth: 20,
  markerHeight: 20,
})

function setColor(c: string) {
  sym.markerFill = c
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（响应式样式）' : '加载中…'))
</script>
