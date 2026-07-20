<template>
  <!-- 1.4 移动地图（组件 center prop 不支持运行期重设，故无「组件」tab） -->
  <Example2DemoShell
    description="用 panTo / panBy / setCenter 平移地图，对应官网「地图 - 移动地图」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/map/pan/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/pan/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/pan/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
