<template>
  <Example2DemoShell
    description="用 JSON 复制 Layer——A 图 v0(Marker) + v1(Rectangle)，v0 经 Layer.fromJSON 复制到仅底图的 B 图，3 种实现（Composable/组合/逃生舱）（对应官网 11.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/json/copy-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/json/copy-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/json/copy-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
