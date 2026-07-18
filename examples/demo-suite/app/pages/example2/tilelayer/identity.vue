<template>
  <!-- 2.14 IDENTITY投影底图 -->
  <Example2DemoShell
    description="IDENTITY 平面坐标系：不做地理投影，直接渲染平面坐标几何（对应官网 2.14；平面坐标无经纬度，中心点例外不设陆家嘴）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/identity/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/identity/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/identity/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/identity/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
