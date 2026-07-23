<template>
  <!-- 3.9 圆弧和贝塞尔曲线 -->
  <Example2DemoShell
    description="ArcCurve / QuadBezierCurve / CubicBezierCurve 三种曲线（对应官网 3.9）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/geometry/arc-bezier/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/geometry/arc-bezier/EscapeImpl.vue';
import MixedImpl from '~/components/example2/geometry/arc-bezier/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
