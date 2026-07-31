<template>
  <Example2DemoShell
    description="LineString.animateShow 逐段绘制线条——hide 后 animateShow 揭示路径（对应官网 9.5）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/animation/line-show/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/animation/line-show/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/animation/line-show/EscapeImpl.vue'
import MixedImpl from '~/components/example2/animation/line-show/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
