<template>
  <Example2DemoShell
    description="flyTo 飞行 + animateTo 动画——4 按钮展示两种 API 的 duration / pitch / bearing 控制（对应官网 9.1）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/animation/fly-to/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/animation/fly-to/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/animation/fly-to/EscapeImpl.vue'
import MixedImpl from '~/components/example2/animation/fly-to/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
