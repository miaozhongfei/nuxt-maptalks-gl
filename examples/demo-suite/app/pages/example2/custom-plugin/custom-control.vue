<template>
  <Example2DemoShell description="自定义 HTML 按钮作为简易控件叠加在地图上——演示创建新控件的思路（对应官网 13.1）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/custom-plugin/custom-control/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
