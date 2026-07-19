<template>
  <Example2DemoShell
    description="useMaptalksLayerControl 控制图层显隐（对应官网 6.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/layer/show-hide/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/show-hide/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/show-hide/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
