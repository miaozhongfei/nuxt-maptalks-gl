<template>
  <!-- 3.4 GeometryCollection -->
  <Example2DemoShell
    description="GeometryCollection：多个几何组合为一个整体统一管理（对应官网 3.4）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/geometry/collection/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/geometry/collection/EscapeImpl.vue'
import MixedImpl from '~/components/example2/geometry/collection/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
