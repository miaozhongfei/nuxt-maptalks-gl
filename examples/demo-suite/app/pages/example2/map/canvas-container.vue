<template>
  <!-- 1.11 在Canvas容器中加载：仅逃生舱可表达（模块口径为 div 容器） -->
  <Example2DemoShell
    description="以 <canvas> 元素作为地图容器直接建图，对应官网「地图 - 在Canvas容器中加载」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/map/canvas-container/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
