<template>
  <Example2DemoShell description="map.toJSON 序列化地图状态（对应官网 11.3）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/demos/example2/json/map-to-json/ComposableImpl.vue'
import MixedImpl from '~/demos/example2/json/map-to-json/MixedImpl.vue'
import EscapeImpl from '~/demos/example2/json/map-to-json/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
