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
        <MaptalksLineString
          :coordinates="[[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]]"
          :options="{ symbol: { lineColor: '#2563eb', lineWidth: 4, lineDasharray: [10, 5], lineCap: 'round', lineJoin: 'round' } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（线样式）' : '加载中…'))
</script>
