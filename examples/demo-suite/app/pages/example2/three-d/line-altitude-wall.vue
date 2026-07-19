<template>
  <Example2DemoShell
    description="LineString 带 altitude + drawAltitude：自动生成从线到地面的垂直墙体（对应官网 4.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/three-d/line-altitude-wall/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/three-d/line-altitude-wall/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/three-d/line-altitude-wall/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/three-d/line-altitude-wall/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
