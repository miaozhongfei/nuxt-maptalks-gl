<template>
  <Example2DemoShell
    description="鹰眼 Overview 控件——内嵌小地图同步全局视野 + maxmize/minimize 按钮，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.13）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/overview/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/overview/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/overview/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/overview/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
