<template>
  <!-- 2.19 底图风格滤镜 -->
  <Example2DemoShell
    description="cssFilter 给底图加 CSS 滤镜风格（sepia/invert/grayscale，对应官网 2.19）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/tilelayer/css-filter/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/tilelayer/css-filter/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/css-filter/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/css-filter/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
