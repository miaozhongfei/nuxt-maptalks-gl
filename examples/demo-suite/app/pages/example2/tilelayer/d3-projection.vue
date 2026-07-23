<template>
  <!-- 2.17 D3投影 -->
  <Example2DemoShell
    description="d3-geo 的 geoAzimuthalEqualArea 投影包装为 maptalks 自定义投影对象（对应官网 2.17）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/tilelayer/d3-projection/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/tilelayer/d3-projection/EscapeImpl.vue';
import MixedImpl from '~/components/example2/tilelayer/d3-projection/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
