<template>
  <!-- 3.9 圆弧和贝塞尔曲线：仅逃生舱可表达（ArcCurve/QuadBezierCurve/CubicBezierCurve 模块无直接封装） -->
  <Example2DemoShell
    description="ArcCurve / QuadBezierCurve / CubicBezierCurve 三种曲线（对应官网 3.9）。"
    :tabs="tabs"
  >
    <template #explanation>
      页内说明三种曲线类型
    </template>
  </Example2DemoShell>
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import EscapeImpl from '~/components/example2/geometry/arc-bezier/EscapeImpl.vue';

const tabs: DemoTab[] = [
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
