<template>
  <div>
    <h1>测试A：MaptalksMap + useMaptalksTileLayer</h1>
    <p style="color:#666">组件地图（通过 ref 取 map） + composable 图层</p>
    <div style="height:480px;width:100%;border:1px solid #e0e0e0;border-radius:8px">
      <MaptalksMap ref="mapCmp" :center="[121.4737, 31.2304]" :zoom="11" />
    </div>
  </div>
</template>

<script setup lang="ts">
const mapCmp = ref()
watch(mapCmp, (cmp) => {
  if (cmp?.map) useMaptalksTileLayer(cmp.map, { source: 'osm' })
})
</script>
