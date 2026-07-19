<template>
  <Example2DemoShell
    description="端点 Marker 自动旋转沿线的方位（对应官网 5.18）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/style/line-marker-rotation/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
