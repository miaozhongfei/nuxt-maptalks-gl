<template>
  <Example2DemoShell
    description="动态添加和移除 VectorLayer（对应官网 6.1）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/layer/add-remove/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/layer/add-remove/EscapeImpl.vue'
import MixedImpl from '~/components/example2/layer/add-remove/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
