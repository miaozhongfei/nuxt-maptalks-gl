<template>
  <Example2DemoShell
    description="Three.js 图层——maptalks.three 插件的 ThreeLayer（three.js 3D 渲染），3 种实现（Composable/组合/逃生舱）（对应官网 12.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/plugin/three-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/plugin/three-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/plugin/three-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
