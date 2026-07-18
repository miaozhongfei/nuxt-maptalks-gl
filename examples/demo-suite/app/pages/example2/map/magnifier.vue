<template>
  <!-- 1.16 地图放大镜（双图叠加技巧） -->
  <Example2DemoShell
    description="跟随鼠标的放大镜小地图：小图中心与缩放实时跟随主图鼠标位置，对应官网「地图 - 地图放大镜」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/map/magnifier/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/map/magnifier/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
