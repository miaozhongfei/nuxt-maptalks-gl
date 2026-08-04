<template>
  <Example2DemoShell
    description="ECharts 图层——maptalks.e3 插件的 E3Layer（echarts 渲染，dom renderer），3 种实现（Composable/组合/逃生舱）（对应官网 12.5）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/plugin/echarts-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/plugin/echarts-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/plugin/echarts-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
