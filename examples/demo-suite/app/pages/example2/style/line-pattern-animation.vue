<template>
  <Example2DemoShell
    description="LineString animate() 驱动模式填充 linePatternDx 偏移动画（对应官网 5.14）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/style/line-pattern-animation/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/line-pattern-animation/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/line-pattern-animation/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
