<template>
  <Example2DemoShell
    description="GeoJSON 转化为 Geometry——Feature（含 properties）转换为 Marker，4 种实现（组件/Composable/组合/逃生舱）（对应官网 11.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/json/geojson-to-geometry/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/json/geojson-to-geometry/ComposableImpl.vue'
import MixedImpl from '~/components/example2/json/geojson-to-geometry/MixedImpl.vue'
import EscapeImpl from '~/components/example2/json/geojson-to-geometry/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
