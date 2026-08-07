<template>
  <!-- 2.18 载入不同投影的TileLayer -->
  <Example2DemoShell
    description="4326 地图叠加 3857 瓦片：图层级 spatialReference 声明不同投影（对应官网 2.18）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/tilelayer/mixed-projection/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/tilelayer/mixed-projection/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/mixed-projection/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/mixed-projection/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
