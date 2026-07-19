<template>
  <Example2DemoShell
    description="DistanceTool 测距工具（对应官网 8.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/demos/example2/interaction/distance-tool/ComponentImpl.vue';
import ComposableImpl from '~/demos/example2/interaction/distance-tool/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/interaction/distance-tool/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/interaction/distance-tool/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
