<template>
  <Example2DemoShell
    description="polygon.containsPoint() 空间判断——点击地图检测是否在矩形内（对应官网 8.15）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/interaction/spatial-relation/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/interaction/spatial-relation/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/interaction/spatial-relation/EscapeImpl.vue'
import MixedImpl from '~/components/example2/interaction/spatial-relation/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
