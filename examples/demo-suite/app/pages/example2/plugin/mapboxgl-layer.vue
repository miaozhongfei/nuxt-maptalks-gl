<template>
  <Example2DemoShell
    description="Mapbox gl 图层——maptalks.mapboxgl 插件的 MapboxglLayer（GL 栅格），3 种实现（Composable/组合/逃生舱）（对应官网 12.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/plugin/mapboxgl-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/plugin/mapboxgl-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/plugin/mapboxgl-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
