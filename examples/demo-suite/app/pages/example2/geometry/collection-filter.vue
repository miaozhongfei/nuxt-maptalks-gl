<template>
  <Example2DemoShell
    description="GeometryCollection.filter() 表达式条件查询子几何（对应官网 3.16）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/geometry/collection-filter/ComposableImpl.vue'
import MixedImpl from '~/components/example2/geometry/collection-filter/MixedImpl.vue'
import EscapeImpl from '~/components/example2/geometry/collection-filter/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
