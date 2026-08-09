<template>
  <Example2DemoShell
    description="HeatLayer 热力图层——maptalks.heatmap 插件（canvas 渲染，支持 maptalks-gl），3 种实现（Composable/组合/逃生舱）（对应官网 12.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/plugin/heat-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/plugin/heat-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/plugin/heat-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
