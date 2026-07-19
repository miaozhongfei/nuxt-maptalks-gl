<template>
  <Example2DemoShell description="自定义地图工具——点击地图绘制 Marker（对应官网 13.3）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/custom-plugin/custom-tool/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
