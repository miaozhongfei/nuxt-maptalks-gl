<template>
  <!-- 1.14 屏幕坐标转换 -->
  <Example2DemoShell
    description="经纬度与容器像素坐标互转（useMaptalksCoordinate / 原生 API），对应官网「地图 - 屏幕坐标转换」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComposableImpl from '~/components/example2/map/coordinate-convert/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/coordinate-convert/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/coordinate-convert/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
