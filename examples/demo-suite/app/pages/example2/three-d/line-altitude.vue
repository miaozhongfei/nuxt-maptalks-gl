<template>
  <Example2DemoShell
    description="LineString 带 altitude: 400m（对应官网 4.3）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/three-d/line-altitude/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/three-d/line-altitude/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/three-d/line-altitude/EscapeImpl.vue'
import MixedImpl from '~/components/example2/three-d/line-altitude/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
