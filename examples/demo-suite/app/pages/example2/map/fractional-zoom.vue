<template>
  <!-- 1.10 细微缩放 -->
  <Example2DemoShell
    description="以 0.1 为步进设置非整数缩放级别（Fractional Zoom），对应官网「地图 - 细微缩放」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/fractional-zoom/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/fractional-zoom/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/fractional-zoom/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/fractional-zoom/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
