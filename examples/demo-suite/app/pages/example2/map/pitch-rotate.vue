<template>
  <!-- 1.2 倾斜与旋转 -->
  <Example2DemoShell
    description="设置与调整地图俯仰角（pitch）和方位角（bearing），对应官网「地图 - 倾斜与旋转」"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu';
import ComponentImpl from '~/components/example2/map/pitch-rotate/ComponentImpl.vue';
import ComposableImpl from '~/components/example2/map/pitch-rotate/ComposableImpl.vue';
import EscapeImpl from '~/components/example2/map/pitch-rotate/EscapeImpl.vue';
import MixedImpl from '~/components/example2/map/pitch-rotate/MixedImpl.vue';

const tabs: DemoTab[] = [
  { key: 'component', label: '组件', comp: ComponentImpl },
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
];
</script>
