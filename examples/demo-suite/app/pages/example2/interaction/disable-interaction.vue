<template>
  <Example2DemoShell
    description="禁用地图的拖动/缩放等交互能力（对应官网 8.1）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/interaction/disable-interaction/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/interaction/disable-interaction/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/interaction/disable-interaction/EscapeImpl.vue';
import MixedImpl from '~/components/example2/interaction/disable-interaction/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
