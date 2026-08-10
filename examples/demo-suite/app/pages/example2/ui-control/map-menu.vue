<template>
  <Example2DemoShell
    description="map.setMenu()（旧 API）vs ui.Menu 封装（新 API），items 数组配置放大/缩小（对应官网 10.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/map-menu/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/map-menu/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/map-menu/EscapeImpl.vue'
import MixedImpl from '~/components/example2/ui-control/map-menu/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
