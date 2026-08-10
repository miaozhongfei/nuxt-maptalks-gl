<template>
  <Example2DemoShell
    description="arrowStyle / arrowPlacement 带箭头的线（对应官网 5.16）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/line-arrow/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/line-arrow/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/line-arrow/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/line-arrow/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
