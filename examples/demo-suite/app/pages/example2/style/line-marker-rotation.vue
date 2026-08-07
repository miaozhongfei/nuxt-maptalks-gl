<template>
  <Example2DemoShell
    description="markerPlacement: 'vertex' 端点沿线自动旋转 Marker 图片（对应官网 5.18）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/line-marker-rotation/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/line-marker-rotation/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/line-marker-rotation/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/line-marker-rotation/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
