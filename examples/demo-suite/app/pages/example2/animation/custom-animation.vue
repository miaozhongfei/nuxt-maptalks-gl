<template>
  <Example2DemoShell
    description="maptalks.animation.Animation.animate() 通用 tween 引擎——符号属性动画 + play/cancel 控制（对应官网 9.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/animation/custom-animation/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/animation/custom-animation/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/animation/custom-animation/EscapeImpl.vue'
import MixedImpl from '~/components/example2/animation/custom-animation/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
