<template>
  <Example2DemoShell
    description="markerRotation 旋转标注角度（对应官网 5.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/marker-rotation/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/marker-rotation/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/marker-rotation/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/marker-rotation/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
