<template>
  <Example2DemoShell
    description="animate({ translate }) 沿箭头线平移动画 + setCoordinates 重置（对应官网 9.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/animation/along-line/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/animation/along-line/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/animation/along-line/EscapeImpl.vue'
import MixedImpl from '~/components/example2/animation/along-line/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
