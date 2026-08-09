<template>
  <Example2DemoShell
    description="ClusterLayer 点聚合——maptalks.markercluster 插件（extends VectorLayer，gl renderer），3 种实现（Composable/组合/逃生舱）（对应官网 12.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/plugin/cluster-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/plugin/cluster-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/plugin/cluster-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
