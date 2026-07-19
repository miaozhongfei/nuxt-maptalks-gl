<template>
  <!-- 3.13 克隆：无 C 实现（几何组件不 expose geometry 引用，无法从组件层面执行 copy） -->
  <Example2DemoShell
    description="geometry.copy() 克隆几何并加回图层（对应官网 3.13）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/demos/example2/geometry/clone/ComposableImpl.vue';
import EscapeImpl from '~/demos/example2/geometry/clone/EscapeImpl.vue';
import MixedImpl from '~/demos/example2/geometry/clone/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
