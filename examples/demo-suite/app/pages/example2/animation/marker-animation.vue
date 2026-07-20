<template>
  <Example2DemoShell
    description="geometry.animate 对 Marker symbol 做变形动画（对应官网 9.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/animation/marker-animation/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/animation/marker-animation/EscapeImpl.vue';
import MixedImpl from '~/components/example2/animation/marker-animation/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
