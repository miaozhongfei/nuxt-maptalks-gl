<template>
  <!-- 1.18 缩放地图容器（纯 CSS 容器技巧，仅逃生舱表达） -->
  <Example2DemoShell
    description="用放大容器 + CSS scale 缩小的方式降低高分屏渲染负载，对应官网「地图 - 缩放地图容器解决高分辨率地图卡顿」。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/demos/example2/map/container-scale/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
