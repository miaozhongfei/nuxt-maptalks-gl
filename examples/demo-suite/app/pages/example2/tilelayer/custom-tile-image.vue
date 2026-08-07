<template>
  <!-- 2.20 自定义处理瓦片图片 -->
  <Example2DemoShell
    description="urlTemplate 函数逐瓦片编程：按坐标奇偶混搭两套底图（对应官网 2.20 的自定义处理思路）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/tilelayer/custom-tile-image/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/tilelayer/custom-tile-image/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/tilelayer/custom-tile-image/EscapeImpl.vue'
import MixedImpl from '~/components/example2/tilelayer/custom-tile-image/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
