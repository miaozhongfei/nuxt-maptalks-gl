<template>
  <Example2DemoShell
    description="Label 内联文字编辑：startEditText()/endEditText() 切换文本编辑模式（对应官网 8.12）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComponentImpl from '~/components/example2/interaction/edit-text/ComponentImpl.vue'
import ComposableImpl from '~/components/example2/interaction/edit-text/ComposableImpl.vue'
import EscapeImpl from '~/components/example2/interaction/edit-text/EscapeImpl.vue'
import MixedImpl from '~/components/example2/interaction/edit-text/MixedImpl.vue'

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
