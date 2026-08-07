<template>
  <Example2DemoShell
    description="markerFillOpacity: { property: 'heat', type: 'identity' } 按属性值驱动样式（10 个 Marker 热力图）（对应官网 5.27）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/property-style/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/property-style/ComposableImpl.vue'
import MixedImpl from '~/components/example2/style/property-style/MixedImpl.vue'
import EscapeImpl from '~/components/example2/style/property-style/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
