<template>
  <Example2DemoShell description="CanvasLayer 响应鼠标点击绘制圆——交互式图层（对应官网 14.2）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/custom-layer/hello-layer-draw/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
