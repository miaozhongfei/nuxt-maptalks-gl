<template>
  <Example2DemoShell
    description="图层选择控件——GroupTileLayer 底图候选 + 叠加图层，hover 切换，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.19）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/layer-switcher/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/layer-switcher/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/layer-switcher/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/layer-switcher/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
