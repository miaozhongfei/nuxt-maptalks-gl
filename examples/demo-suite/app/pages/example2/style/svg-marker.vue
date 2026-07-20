<template>
  <Example2DemoShell
    description="markerType: 'path' 用 SVG 路径作为 Marker 形状（对应官网 5.6）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/svg-marker/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/svg-marker/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/svg-marker/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/svg-marker/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
