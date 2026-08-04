<template>
  <Example2DemoShell
    description="创建地图工具——自定义类 extends mt.MapTool（onEnable 建图层 / onDisable 移除 / click 加 Marker / 右键清空）+ new CustomTool().addTo(map)，3 种实现（Composable/组合/逃生舱）（对应官网 13.3）。"
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import type { DemoTab } from '~/data/example2-menu'
import ComposableImpl from '~/components/example2/custom-plugin/custom-tool/ComposableImpl.vue'
import MixedImpl from '~/components/example2/custom-plugin/custom-tool/MixedImpl.vue'
import EscapeImpl from '~/components/example2/custom-plugin/custom-tool/EscapeImpl.vue'

const tabs: DemoTab[] = [
  { key: 'composable', label: 'Composable', comp: ComposableImpl },
  { key: 'mixed', label: '组合', comp: MixedImpl },
  { key: 'escape', label: '逃生舱', comp: EscapeImpl },
]
</script>
