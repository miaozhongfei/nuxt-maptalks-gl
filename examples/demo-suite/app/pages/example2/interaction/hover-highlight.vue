<template>
  <Example2DemoShell
    description="鼠标悬停高亮图形（对应官网 8.14）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/hover-highlight/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/hover-highlight/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/hover-highlight/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/hover-highlight/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
