<template>
  <Example2DemoShell
    description="Panel 面板控件——2 个官网布局（文本可拖拽 / 自定义 HTML），4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.12）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/panel/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/panel/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/panel/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/panel/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
