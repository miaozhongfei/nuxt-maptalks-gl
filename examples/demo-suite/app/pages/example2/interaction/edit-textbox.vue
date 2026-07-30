<template>
  <Example2DemoShell
    description="TextBox 几何编辑：startEdit()/endEdit() 切换控制点调整宽高模式（对应官网 8.11）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import ComponentImpl from '~/components/example2/interaction/edit-textbox/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/edit-textbox/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/edit-textbox/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/edit-textbox/MixedImpl.vue';
import type { DemoTab } from '~/data/example2-menu';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
