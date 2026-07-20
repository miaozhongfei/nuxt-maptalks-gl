<template>
  <!-- 1.7 自动适配区域（模块无 fitExtent 的组件封装，故无「组件」tab） -->
  <Example2DemoShell
    description="将地图视野自动适配到指定几何的范围（fitExtent），对应官网「地图 - 自动适配区域」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/map/fit-extent/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/fit-extent/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/fit-extent/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
