<template>
  <Example2DemoShell
    description="polygonPatternFile 面模式填充（对应官网 5.21）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/polygon-pattern/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/polygon-pattern/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/style/polygon-pattern/EscapeImpl.vue'
import MixedImpl from '~/components/example2/style/polygon-pattern/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
