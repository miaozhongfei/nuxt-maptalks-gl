<template>
  <Example2DemoShell
    description="getGeometryById 精确获取指定 ID 的图形并修改样式（对应官网 6.9）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/layer/get-by-id/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/layer/get-by-id/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/layer/get-by-id/EscapeImpl.vue'
import MixedImpl from '~/components/example2/layer/get-by-id/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
