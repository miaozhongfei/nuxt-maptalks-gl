<template>
  <Example2DemoShell
    description="用 JSON 载入地图——静态 mapJSON（options/baseLayer/layers）经 Map.fromJSON 直接建图，3 种实现（Composable/组合/逃生舱）（对应官网 11.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/json/map-from-json/ComposableImpl.vue'
import MixedImpl from '~/components/example2/json/map-from-json/MixedImpl.vue'
import EscapeImpl from '~/components/example2/json/map-from-json/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
