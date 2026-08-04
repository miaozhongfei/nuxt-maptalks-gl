<template>
  <Example2DemoShell
    description="创建新的控件——自定义类 extends mt.control.Control + buildOn 返回 DOM + mergeOptions + addControl，3 种实现（Composable/组合/逃生舱）（对应官网 13.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-plugin/custom-control/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-plugin/custom-control/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-plugin/custom-control/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
