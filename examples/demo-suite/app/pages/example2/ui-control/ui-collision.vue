<template>
  <Example2DemoShell
    description="UI 碰撞——批量 UIMarker 开启 collision，簇内重叠按权重隐藏低优先级，USwitch 实时切换，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.9）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/ui-collision/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/ui-collision/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/ui-collision/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/ui-collision/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
