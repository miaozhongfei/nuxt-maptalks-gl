<template>
  <!-- 2.1 Canvas渲染方式的瓦片图层 -->
  <Example2DemoShell
    description="renderer: 'canvas' 强制瓦片图层走 Canvas 渲染（对应官网 2.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/tilelayer/canvas-renderer/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/tilelayer/canvas-renderer/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/tilelayer/canvas-renderer/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/tilelayer/canvas-renderer/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
