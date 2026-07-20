<template>
  <Example2DemoShell
    description="lineGradientProperty 按属性值驱动线渐变颜色（对应官网 5.15）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/line-gradient/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/line-gradient/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/style/line-gradient/EscapeImpl.vue';
import MixedImpl from '~/components/example2/style/line-gradient/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
