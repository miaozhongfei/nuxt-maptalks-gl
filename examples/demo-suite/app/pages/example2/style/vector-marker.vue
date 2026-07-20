<template>
  <Example2DemoShell
    description="用 markerType 矢量标注（内置 diamond/ellipse/square 等形状，对应官网 5.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/vector-marker/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/vector-marker/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/vector-marker/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/vector-marker/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
