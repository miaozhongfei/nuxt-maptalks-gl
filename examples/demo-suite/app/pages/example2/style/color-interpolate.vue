<template>
  <Example2DemoShell
    description="5 个 Marker 沿线的颜色插值（从红到蓝，对应官网 5.28）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/style/color-interpolate/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
