<template>
  <Example2DemoShell
    description="Marker 用图片标注（markerFile 指向图片 URL，对应官网 5.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/style/image-marker/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/style/image-marker/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/style/image-marker/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/style/image-marker/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
