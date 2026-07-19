<template>
  <Example2DemoShell description="map.fromJSON 恢复地图状态（对应官网 11.4）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/demos/example2/json/map-from-json/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/json/map-from-json/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/json/map-from-json/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
