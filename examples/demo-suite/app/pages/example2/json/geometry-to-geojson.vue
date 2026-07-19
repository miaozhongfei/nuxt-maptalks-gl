<template>
  <Example2DemoShell description="geometry.toGeoJSON 导出为 GeoJSON（对应官网 11.2）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/demos/example2/json/geometry-to-geojson/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/json/geometry-to-geojson/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/json/geometry-to-geojson/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
