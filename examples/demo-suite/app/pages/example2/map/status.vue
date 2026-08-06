<template>
  <!-- 1.6 获取地图状态 -->
  <Example2DemoShell
    description="读取地图中心、缩放、俯仰、旋转等状态；Composable 版为响应式实时回流（对应官网 1.6）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/map/status/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/map/status/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/map/status/EscapeImpl.vue'
import MixedImpl from '~/components/example2/map/status/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
