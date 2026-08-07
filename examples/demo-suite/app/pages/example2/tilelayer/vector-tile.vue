<template>
  <!-- 2.6 Vector-Tile图层 -->
  <Example2DemoShell
    description="VectorTileLayer 加载 MVT 矢量瓦片并用 style 规则渲染（对应官网 2.6）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/tilelayer/vector-tile/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/tilelayer/vector-tile/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/vector-tile/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/vector-tile/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
