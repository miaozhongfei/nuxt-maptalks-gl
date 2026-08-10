<template>
  <Example2DemoShell
    description="InfoWindow 内容溢出滚动——长文本/长表格/混合富内容/enableScrollbar，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/infownd-scroll/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/infownd-scroll/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/infownd-scroll/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/infownd-scroll/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
