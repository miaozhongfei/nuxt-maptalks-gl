<template>
  <Example2DemoShell description="GeoJSON.toGeometry 转换为 maptalks 几何（对应官网 11.1）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/demos/example2/json/geojson-to-geometry/ComponentImpl.vue'
import ComposableImpl from '~/demos/example2/json/geojson-to-geometry/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/json/geojson-to-geometry/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/json/geojson-to-geometry/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
