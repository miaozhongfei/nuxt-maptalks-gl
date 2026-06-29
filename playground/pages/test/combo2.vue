<template>
  <div>
    <h1>测试B：useMaptalks + MaptalksTileLayer</h1>
    <p style="color:#666">composable 地图 + 组件图层</p>
    <div ref="el" style="height:480px;width:100%;border:1px solid #e0e0e0;border-radius:8px" />
    <MaptalksTileLayer v-if="map" source="osm" />
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { MAP_KEY } from '~~/src/runtime/core/map-context'
const el = ref<HTMLElement|null>(null)
const { map } = useMaptalks(el, { center: [121.4737, 31.2304], zoom: 11 })
provide(MAP_KEY, map)
</script>
