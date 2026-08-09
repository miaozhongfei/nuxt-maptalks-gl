<template>
  <Example2DemoShell
    description="Marker 几何编辑：startEdit()/endEdit() 切换控制点拖拽模式（对应官网 8.7）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/interaction/edit-marker/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/interaction/edit-marker/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/interaction/edit-marker/EscapeImpl.vue'
import MixedImpl from '~/components/example2/interaction/edit-marker/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
