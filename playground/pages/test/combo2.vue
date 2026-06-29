<template>
  <div>
    <h1>测试B：useMaptalks + useMaptalksTileLayer</h1>
    <p style="color:#666">composable 地图 + composable 图层（对照基准，应能拖拽）</p>
    <div ref="el" style="height:480px;width:100%;border:1px solid #e0e0e0;border-radius:8px" />
  </div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement|null>(null)
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 })
useMaptalksTileLayer(map, { source: 'osm' })
</script>
