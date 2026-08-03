<template>
  <Example2DemoShell
    description="控件显示与隐藏——Zoom 的 Show/Hide/Remove 三操作（Toolbar 控制），4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.18）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/control-toggle/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/control-toggle/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/control-toggle/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/control-toggle/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
