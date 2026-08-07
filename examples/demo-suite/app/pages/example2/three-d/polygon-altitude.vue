<template>
  <Example2DemoShell
    description="Polygon 带 altitude: 300m（对应官网 4.5）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/three-d/polygon-altitude/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/three-d/polygon-altitude/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/three-d/polygon-altitude/EscapeImpl.vue'
import MixedImpl from '~/components/example2/three-d/polygon-altitude/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
