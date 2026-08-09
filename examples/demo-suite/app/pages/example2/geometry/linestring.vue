<template>
  <Example2DemoShell
    description="绘制 LineString 折线（对应官网 3.2）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/geometry/linestring/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/geometry/linestring/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/geometry/linestring/EscapeImpl.vue'
import MixedImpl from '~/components/example2/geometry/linestring/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
