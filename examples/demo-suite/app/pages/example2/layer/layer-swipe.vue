<template>
  <Example2DemoShell
    description="两张同步地图并排对比不同底图样式（对应官网 6.17 图层卷帘效果）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/layer/layer-swipe/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
