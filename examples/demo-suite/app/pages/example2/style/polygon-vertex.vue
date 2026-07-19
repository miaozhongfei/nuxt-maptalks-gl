<template>
  <Example2DemoShell
    description="vertexMarker 在多边形顶点显示标注（对应官网 5.23）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/polygon-vertex/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/polygon-vertex/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/polygon-vertex/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/polygon-vertex/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
