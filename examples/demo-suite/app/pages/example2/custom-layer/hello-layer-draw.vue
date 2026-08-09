<template>
  <Example2DemoShell
    description="HelloLayer 交互绘制——自定义图层 + dom renderer（drawOnInteracting 交互重绘 _drawnData），点击地图添加文字、拖动/缩放跟随，3 种实现（Composable/组合/逃生舱）（对应官网 14.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-layer/hello-layer-draw/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-layer/hello-layer-draw/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-layer/hello-layer-draw/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
