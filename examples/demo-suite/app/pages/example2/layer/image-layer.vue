<template>
  <Example2DemoShell
    description="ImageLayer 在地图上叠加图片（对应官网 6.18）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/layer/image-layer/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/layer/image-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/layer/image-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/layer/image-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
