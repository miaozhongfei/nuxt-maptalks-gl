<template>
  <Example2DemoShell
    description="Marker zIndex 控制重叠绘制顺序（对应官网 6.12）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/layer/geometry-zindex/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/layer/geometry-zindex/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/geometry-zindex/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/geometry-zindex/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
