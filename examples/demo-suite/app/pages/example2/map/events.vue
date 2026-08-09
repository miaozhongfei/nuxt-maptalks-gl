<template>
  <!-- 1.12 监听地图事件（Map 组件不转发地图事件，故无「组件」tab） -->
  <Example2DemoShell
    description="监听 click / dblclick / zoomend / moveend 等地图事件并输出日志（对应官网 1.12）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/map/events/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/map/events/EscapeImpl.vue'
import MixedImpl from '~/components/example2/map/events/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
