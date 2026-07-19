<template>
  <Example2DemoShell
    description="线 + Marker 组合样式（对应官网 5.24）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/composite-style/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/composite-style/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/composite-style/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/composite-style/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
