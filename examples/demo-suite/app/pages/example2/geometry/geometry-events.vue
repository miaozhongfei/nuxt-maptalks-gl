<template>
  <Example2DemoShell
    description="监听几何的 click/mouseenter/mouseout 等事件（对应官网 3.14）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/geometry/geometry-events/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/geometry/geometry-events/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/geometry/geometry-events/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/geometry/geometry-events/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
