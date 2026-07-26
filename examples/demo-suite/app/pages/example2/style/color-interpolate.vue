<template>
  <Example2DemoShell
    description="markerFill: { type: 'color-interpolate' } 按属性值插值颜色 green→yellow→red（对应官网 5.28）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/color-interpolate/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/color-interpolate/ComposableImpl.vue';
import MixedImpl from '~/components/example2/style/color-interpolate/MixedImpl.vue';
import EscapeImpl from '~/components/example2/style/color-interpolate/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
