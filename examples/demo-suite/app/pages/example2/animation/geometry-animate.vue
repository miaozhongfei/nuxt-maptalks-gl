<template>
  <Example2DemoShell
    description="geometry.animate({ translate: [dx, dy] }) 平移动画 + focus 跟随（对应官网 9.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/animation/geometry-animate/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/animation/geometry-animate/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/animation/geometry-animate/EscapeImpl.vue'
import MixedImpl from '~/components/example2/animation/geometry-animate/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
