<template>
  <Example2DemoShell
    description="指北针控件——4 个官网布局（pitch/bearing 旋转展示），4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.15）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/compass-control/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/compass-control/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/compass-control/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/compass-control/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
