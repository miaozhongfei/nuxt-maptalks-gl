<template>
  <Example2DemoShell
    description="CanvasLayer 自定义 Canvas 画板图层（对应官网 6.14）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/layer/canvas-layer/ComposableImpl.vue';
import MixedImpl from '~/components/example2/layer/canvas-layer/MixedImpl.vue';
import EscapeImpl from '~/components/example2/layer/canvas-layer/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
