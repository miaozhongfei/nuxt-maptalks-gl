<template>
  <!-- 2.13 4326投影底图 -->
  <Example2DemoShell
    description="EPSG:4326 空间参考 + 4326 瓦片矩阵底图（NASA GIBS，对应官网 2.13）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/epsg4326/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/epsg4326/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/epsg4326/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/epsg4326/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
