<template>
  <Example2DemoShell
    description="setOpacity 动态调整图层透明度（对应官网 6.3）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/layer/layer-opacity/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/layer/layer-opacity/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/layer/layer-opacity/EscapeImpl.vue'
import MixedImpl from '~/components/example2/layer/layer-opacity/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
