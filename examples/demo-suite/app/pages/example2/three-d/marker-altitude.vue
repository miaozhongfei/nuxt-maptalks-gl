<template>
  <Example2DemoShell
    description="Marker 带 altitude: 500m（对应官网 4.1）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/three-d/marker-altitude/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/three-d/marker-altitude/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/three-d/marker-altitude/EscapeImpl.vue'
import MixedImpl from '~/components/example2/three-d/marker-altitude/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
