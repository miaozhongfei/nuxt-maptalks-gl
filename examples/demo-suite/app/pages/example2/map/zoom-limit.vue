<template>
  <!-- 1.9 限制缩放级别 -->
  <Example2DemoShell
    description="用 minZoom / maxZoom 限制地图缩放范围，组件版滑杆可热更新，对应官网「地图 - 限制缩放级别」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/zoom-limit/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/zoom-limit/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/zoom-limit/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/zoom-limit/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
