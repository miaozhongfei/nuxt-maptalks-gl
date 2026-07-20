<template>
  <Example2DemoShell description="鹰眼 Overview 控件——使用第二张地图同步显示全局视野（对应官网 10.13）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/ui-control/overview/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
