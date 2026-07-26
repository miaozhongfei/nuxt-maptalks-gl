<template>
  <Example2DemoShell
    description="ui.UIMarker HTML 自定义标注按钮到地图坐标（对应官网 5.29）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/style/html-marker/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/style/html-marker/ComposableImpl.vue';
import MixedImpl from '~/components/example2/style/html-marker/MixedImpl.vue';
import EscapeImpl from '~/components/example2/style/html-marker/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
