<template>
  <!-- 2.11 设置瓦片图层透明度 -->
  <Example2DemoShell
    description="opacity 选项与 setOpacity() 动态调整瓦片透明度（对应官网 2.11）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/tilelayer/tile-opacity/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/tilelayer/tile-opacity/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/tile-opacity/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/tile-opacity/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
