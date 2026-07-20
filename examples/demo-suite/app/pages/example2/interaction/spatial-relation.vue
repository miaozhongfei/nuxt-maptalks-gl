<template>
  <Example2DemoShell
    description="鼠标 click 事件中坐标与像素的空间关系（对应官网 8.15）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/interaction/spatial-relation/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
