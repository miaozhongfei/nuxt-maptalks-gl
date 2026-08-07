<template>
  <Example2DemoShell
    description="直接使用 layer 的 show/hide 控制图层显隐（对应官网 6.2）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/layer/show-hide/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/layer/show-hide/ComposableImpl.vue'
import MixedImpl from '~/components/example2/layer/show-hide/MixedImpl.vue'
import EscapeImpl from '~/components/example2/layer/show-hide/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
