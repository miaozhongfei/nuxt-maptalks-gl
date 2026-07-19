<template>
  <Example2DemoShell
    description="setStyle 批量设置图层内所有图形的样式（对应官网 6.11）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/layer/layer-style/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/layer-style/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/layer-style/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
