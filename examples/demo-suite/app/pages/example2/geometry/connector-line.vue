<template>
  <Example2DemoShell
    description="ConnectorLine / ArcConnectorLine 连接两个几何（对应官网 3.12）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/geometry/connector-line/ComposableImpl.vue'
import MixedImpl from '~/components/example2/geometry/connector-line/MixedImpl.vue'
import EscapeImpl from '~/components/example2/geometry/connector-line/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
