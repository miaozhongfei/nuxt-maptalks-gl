<template>
  <Example2DemoShell description="E3Layer maptalks.e3 ECharts 3D 图层（对应官网 12.5）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/plugin/echarts-layer/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
