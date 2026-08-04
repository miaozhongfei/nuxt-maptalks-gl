<template>
  <Example2DemoShell
    description="创建新的 UI 组件——自定义类 extends mt.ui.UIComponent（buildOn + getOffset 居中 + zoomend 闪烁）+ mergeOptions + addTo(map).show()，3 种实现（Composable/组合/逃生舱）（对应官网 13.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-plugin/custom-ui/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-plugin/custom-ui/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-plugin/custom-ui/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
