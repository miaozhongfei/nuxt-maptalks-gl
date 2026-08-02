<template>
  <Example2DemoShell     description="几何体 InfoWindow——Marker 点击弹出，字符串内容 vs 自定义 slot/DOM 内容，4 种实现（对应官网 10.5）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/ui-control/geometry-infownd/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/ui-control/geometry-infownd/ComposableImpl.vue'
import MixedImpl from '~/components/example2/ui-control/geometry-infownd/MixedImpl.vue'
import EscapeImpl from '~/components/example2/ui-control/geometry-infownd/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
