<template>
  <Example2DemoShell
    description="ECharts 南丁格尔玫瑰图，挂在 UIMarker 上（对应官网 5.31）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/style/echarts-chart/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/echarts-chart/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/echarts-chart/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
