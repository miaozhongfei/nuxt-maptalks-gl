<template>
  <Example2DemoShell
    description="markerDx/markerDy 偏移 Marker 渲染锚点（对应官网 5.7）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/marker-alignment/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/marker-alignment/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/marker-alignment/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/marker-alignment/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
