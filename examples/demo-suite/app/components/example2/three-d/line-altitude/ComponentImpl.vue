<template>
  <div>
    <MaptalksMap
      ref="mc"
      :center="[121.5057, 31.2453]"
      :zoom="13"
      :pitch="55"
      base-layer="osm"
      class="relative rounded border border-default overflow-hidden"
      style="height: 480px"
    >
      <MaptalksVectorLayer :options="{ enableAltitude: true, altitudeProperty: 'altitude', drawAltitude: true }">
        <MaptalksLineString
          :coordinates="[[121.49, 31.235], [121.5057, 31.2453], [121.52, 31.252]]"
          :options="{ properties: { altitude: 400 }, symbol: { lineColor: '#dc2626', lineWidth: 3 } }"
        />
      </MaptalksVectorLayer>
    </MaptalksMap>
    <p class="text-xs text-muted mt-1">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
const mc = ref<MaptalksMapExposed | null>(null)

const status = computed(() => (toValue(mc.value?.map) ? '地图已创建（线高度 400m）' : '加载中…'))
</script>
