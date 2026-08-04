<template>
  <Example2DemoShell
    description="HelloLayer 动画图层——自定义图层 + dom renderer（animation 选项 + needToRedraw 恒 true，文字颜色 300ms 循环换色），3 种实现（Composable/组合/逃生舱）（对应官网 14.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-layer/hello-layer-animation/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-layer/hello-layer-animation/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-layer/hello-layer-animation/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
