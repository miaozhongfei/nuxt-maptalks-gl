<template>
  <!-- 1.3 拖动倾斜与旋转 -->
  <Example2DemoShell
    description="通过拖拽（右键或 Ctrl+左键）改变俯仰与旋转，并演示开关的热更新，对应官网「地图 - 拖动倾斜与旋转」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/map/drag-pitch-rotate/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/map/drag-pitch-rotate/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/map/drag-pitch-rotate/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/map/drag-pitch-rotate/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
