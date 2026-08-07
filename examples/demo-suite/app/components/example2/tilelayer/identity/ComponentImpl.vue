<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[0, 0]"
      :zoom="2"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
      :options="{ spatialReference: srIdentity }"
    >
      <MaptalksVectorLayer>
        <MaptalksMarker :coordinates="[0, 0]" />
        <MaptalksRectangle
          :coordinates="[500, 500]"
          :width="2000"
          :height="1200"
          :options="{ symbol: { polygonFill: '#3b82f6', polygonOpacity: 0.3, lineColor: '#2563eb', lineWidth: 2 } }"
        />
        <MaptalksCircle
          :coordinates="[-1500, -800]"
          :radius="400"
          :options="{ symbol: { polygonFill: '#22c55e', polygonOpacity: 0.3, lineColor: '#16a34a', lineWidth: 2 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)
// IDENTITY 平面坐标系：无投影，直接以平面坐标渲染（常用于室内图/游戏地图）
const srIdentity = {
  projection: 'identity',
  resolutions: [32, 16, 8, 4, 2, 1],
  fullExtent: { top: 10000, left: -10000, bottom: -10000, right: 10000 },
}

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（IDENTITY 平面坐标）' : '加载中…'))
</script>
