<template>
  <!-- 1.13 同步地图（双地图联动难以纯模板表达，故无「组件」tab；组合版即组件 + sync composable） -->
  <Example2DemoShell
    description="两张地图视图联动：useMaptalksSync 一行搞定，逃生舱演示官网原生事件镜像写法，对应官网「地图 - 同步地图」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/map/sync-maps/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/sync-maps/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/sync-maps/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
