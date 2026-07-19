<template>
  <Example2DemoShell
    description="Switch 实时开关地图拖拽和缩放功能（对应官网 8.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/interaction/map-switches/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/interaction/map-switches/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/interaction/map-switches/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/interaction/map-switches/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
