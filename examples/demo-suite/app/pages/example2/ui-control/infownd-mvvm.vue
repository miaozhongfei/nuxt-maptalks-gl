<template>
  <Example2DemoShell description="InfoWindow 内容动态更新（对应官网 10.10 MVVM 绑定思路）。" :tabs="tabs" />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import EscapeImpl from '~/components/example2/ui-control/infownd-mvvm/EscapeImpl.vue'
const tabs: DemoTab[] = [{ key: 'escape', label: '逃生舱', comp: EscapeImpl }]
</script>
