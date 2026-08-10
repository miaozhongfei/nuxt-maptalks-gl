<template>
  <Example2DemoShell
    description="绘制 Polygon 多边形（对应官网 3.3）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/geometry/polygon/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/geometry/polygon/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/geometry/polygon/EscapeImpl.vue'
import MixedImpl from '~/components/example2/geometry/polygon/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
