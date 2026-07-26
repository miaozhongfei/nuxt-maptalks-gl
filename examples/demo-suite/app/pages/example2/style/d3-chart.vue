<template>
  <Example2DemoShell
    description="D3 四叉树 + 画刷交互可视化，挂在 UIMarker 上（对应官网 5.30）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/style/d3-chart/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/d3-chart/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/d3-chart/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
