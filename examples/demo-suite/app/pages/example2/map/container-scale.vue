<template>
  <!-- 1.18 缩放地图容器 -->
  <Example2DemoShell
    description="用放大容器 + CSS scale 缩小的方式降低高分屏渲染负载，对应官网「地图 - 缩放地图容器解决高分辨率地图卡顿」。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/container-scale/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/container-scale/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/container-scale/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/container-scale/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
