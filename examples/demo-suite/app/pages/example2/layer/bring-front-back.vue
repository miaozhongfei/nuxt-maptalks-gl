<template>
  <Example2DemoShell
    description="bringToFront/bringToBack 调整图层叠加顺序（对应官网 6.4）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/layer/bring-front-back/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/layer/bring-front-back/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/layer/bring-front-back/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
