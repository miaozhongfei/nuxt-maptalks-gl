<template>
  <Example2DemoShell
    description="DrawTool 绘制——5 模式按钮切换 Point/LineString/Polygon/Circle/Rectangle（对应官网 8.5）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/interaction/draw-tool/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/interaction/draw-tool/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/interaction/draw-tool/EscapeImpl.vue'
import MixedImpl from '~/components/example2/interaction/draw-tool/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
