<template>
  <Example2DemoShell
    description="HelloLayer——自定义图层类（extends mt.Layer + setData/getData + mergeOptions）+ 自定义 CanvasRenderer（draw 绘制文字）+ registerRenderer + addTo，3 种实现（Composable/组合/逃生舱）（对应官网 14.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-layer/hello-layer/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-layer/hello-layer/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-layer/hello-layer/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
