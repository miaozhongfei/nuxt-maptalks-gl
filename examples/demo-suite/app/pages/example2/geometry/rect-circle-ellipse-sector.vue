<template>
  <Example2DemoShell
    description="一页画全矩形/圆形/椭圆/扇形四种规则图形（对应官网 3.8）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/geometry/rect-circle-ellipse-sector/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/geometry/rect-circle-ellipse-sector/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/geometry/rect-circle-ellipse-sector/EscapeImpl.vue';
import MixedImpl from '~/components/example2/geometry/rect-circle-ellipse-sector/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
