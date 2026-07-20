<template>
  <!-- 1.8 限制地图区域 -->
  <Example2DemoShell
    description="用 maxExtent 把可视范围限制在指定区域内，对应官网「地图 - 限制地图区域」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/max-extent/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/max-extent/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/max-extent/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/max-extent/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
