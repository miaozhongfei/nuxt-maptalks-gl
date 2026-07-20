<template>
  <Example2DemoShell
    description="用 HTML 内联 SVG 饼图作为 Marker 内容（对应官网 5.30；纯 SVG，无需外部库）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/style/d3-chart/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
