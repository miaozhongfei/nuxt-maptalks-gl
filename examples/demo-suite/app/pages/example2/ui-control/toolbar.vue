<template>
  <Example2DemoShell
    description="Toolbar 控件——4 个官网布局（位置/方向/子菜单）+ 点击日志，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.11）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/toolbar/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/toolbar/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/toolbar/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/toolbar/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
