<template>
  <Example2DemoShell
    description="同一图层放置多个不同图片的 Marker（对应官网 5.2）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/multi-image-marker/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/multi-image-marker/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/multi-image-marker/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/multi-image-marker/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
