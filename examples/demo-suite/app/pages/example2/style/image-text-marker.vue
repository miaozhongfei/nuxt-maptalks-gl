<template>
  <Example2DemoShell
    description="Marker 同时显示图片和文字标注（对应官网 5.11）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/image-text-marker/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/image-text-marker/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/image-text-marker/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/image-text-marker/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
