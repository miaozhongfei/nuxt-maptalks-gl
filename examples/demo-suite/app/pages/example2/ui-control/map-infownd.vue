<template>
  <Example2DemoShell
    description="InfoWindow 地图信息框——字符串内容 vs 自定义 DOM/slot 内容，4 种实现（组件/Composable/组合/逃生舱）（对应官网 10.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/map-infownd/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/map-infownd/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/map-infownd/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/map-infownd/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
