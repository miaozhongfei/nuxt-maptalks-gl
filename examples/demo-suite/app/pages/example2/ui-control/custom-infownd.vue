<template>
  <Example2DemoShell
    description="InfoWindow 自定义内容——简单/富 HTML 字符串、交互 DOM、响应式内容更新，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/custom-infownd/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/custom-infownd/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/custom-infownd/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/custom-infownd/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
