<template>
  <Example2DemoShell
    description="用 JSON 复制 Geometry——A 图 v 图层（Marker + Rectangle），rect 经 Geometry.fromJSON 复制到 B 图的空 v 图层，3 种实现（Composable/组合/逃生舱）（对应官网 11.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/json/copy-geometry/ComposableImpl.vue'
import MixedImpl from '~/components/example2/json/copy-geometry/MixedImpl.vue'
import EscapeImpl from '~/components/example2/json/copy-geometry/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
