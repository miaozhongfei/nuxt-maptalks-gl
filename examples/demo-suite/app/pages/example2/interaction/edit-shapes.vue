<template>
  <Example2DemoShell
    description="Rectangle/Circle/Ellipse 几何编辑：startEdit()/endEdit() 切换控制点拖拽模式（对应官网 8.10）"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/interaction/edit-shapes/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/interaction/edit-shapes/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/interaction/edit-shapes/EscapeImpl.vue'
import MixedImpl from '~/components/example2/interaction/edit-shapes/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
