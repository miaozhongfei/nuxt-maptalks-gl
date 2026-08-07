<template>
  <Example2DemoShell
    description="Polygon 基础面样式（对应官网 5.20）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/polygon-style/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/polygon-style/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/style/polygon-style/EscapeImpl.vue'
import MixedImpl from '~/components/example2/style/polygon-style/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
