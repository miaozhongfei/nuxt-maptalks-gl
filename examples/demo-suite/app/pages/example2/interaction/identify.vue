<template>
  <Example2DemoShell
    description="点击地图点选最近几何并高亮（对应官网 8.13）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/identify/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/identify/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/identify/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/identify/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
