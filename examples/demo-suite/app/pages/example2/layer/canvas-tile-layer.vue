<template>
  <Example2DemoShell
    description="CanvasTileLayer 自定义瓦片绘制（对应官网 6.16）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/layer/canvas-tile-layer/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
