<template>
  <Example2DemoShell
    description="响应式 symbol 更新：按钮切换 Marker 颜色（对应官网 5.25）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/style/update-symbol/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/style/update-symbol/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/style/update-symbol/EscapeImpl.vue'
import MixedImpl from '~/components/example2/style/update-symbol/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
