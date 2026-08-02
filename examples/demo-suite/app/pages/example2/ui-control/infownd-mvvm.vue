<template>
  <Example2DemoShell
    description="InfoWindow 绑定 MVVM 组件——弹框内 Vue 响应式实时更新（v-model/计数器/v-for），4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.10）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/infownd-mvvm/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/infownd-mvvm/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/infownd-mvvm/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/infownd-mvvm/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
