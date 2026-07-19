<template>
  <Example2DemoShell description="CanvasLayer 画板图层——绘制 Hello 文字（对应官网 14.1）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/demos/example2/custom-layer/hello-layer/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
