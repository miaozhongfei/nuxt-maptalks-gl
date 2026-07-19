<template>
  <Example2DemoShell
    description="useMaptalksCamera.flyTo 平滑飞行到目标位置（对应官网 9.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/animation/fly-to/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/animation/fly-to/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/animation/fly-to/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
