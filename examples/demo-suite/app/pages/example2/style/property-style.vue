<template>
  <Example2DemoShell
    description="根据 geometry.properties 数据驱动样式选择（对应官网 5.27）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/style/property-style/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/property-style/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/property-style/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
